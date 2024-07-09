import {ethers} from "hardhat";
import {EvmUtils} from "../shared/helpers/EvmUtils";

// Configuration

const testGasUsageResultFilePath = "./tests-gas-usages.json";
const testsDirectory = "./test";

// Implementation

const fs = require('fs');

interface TestGasUsageInfo {
    firstBlock: number;
    lastBlock: number;
    gasUsed: string;
}

const testGasUsages: {[key: string]: TestGasUsageInfo} = {};
let allTestTitlesMap: {[key: string]: boolean} | null = null;

export async function runWithSavingGasUsage(
    title: string,
    fn: () => void
) {
    await storeBefore(title);
    await fn();
    await storeAfter(title);
}

async function storeBefore(title: string) {
    testGasUsages[title] = {
        firstBlock: await EvmUtils.getCurrentBlock(),
        lastBlock: 0,
        gasUsed: "0"
    };
}

async function storeAfter(title: string) {
    testGasUsages[title].lastBlock = await EvmUtils.getCurrentBlock();
    const gasUsed = await calculateGasUsed(
        testGasUsages[title].firstBlock,
        testGasUsages[title].lastBlock,
    );

    testGasUsages[title].gasUsed = gasUsed.toString(10);

    await saveTestGasUsageToFile(title, testGasUsages[title]);
}

export async function calculateGasUsed(
    firstBlock: number,
    lastBlock: number
): Promise<bigint> {
    const blockNumbers = [];

    for (let i = firstBlock + 1; i <= lastBlock; i++) {
        blockNumbers.push(i);
    }

    const gasUsedForBlocks = await Promise.all(
        blockNumbers.map(async blockNumber => {
            const block = (await ethers.provider.getBlock(blockNumber))!;
            return block.gasUsed;
        })
    )

    return gasUsedForBlocks.reduce((total, currentValue) => total + currentValue, 0n);
}

export async function saveTestGasUsageToFile(title: string, testGasUsage: TestGasUsageInfo) {
    // Creates empty json file if no file found
    if (!fs.existsSync(testGasUsageResultFilePath)) {
        fs.writeFileSync(testGasUsageResultFilePath, JSON.stringify({}));
    }

    // Read file and try to get json object, if file data != json object => create new EMPTY json object (data will be lost)
    const fileData = fs.readFileSync(testGasUsageResultFilePath);
    let jsonObjectFromFile = getJsonObjectFromFileData(fileData);
    if (jsonObjectFromFile == null) {
        jsonObjectFromFile = {};
    }

    // Insert test data usage to the object
    jsonObjectFromFile[title] = testGasUsage;

    removeUnknownTitles(jsonObjectFromFile);

    jsonObjectFromFile = sortObjectPropertiesByName(jsonObjectFromFile);

    // Save pretty json object to file
    fs.writeFileSync(testGasUsageResultFilePath, JSON.stringify(jsonObjectFromFile, null, "\t"));
}

function sortObjectPropertiesByName(obj: {[key: string]: any}) {
    return Object.keys(obj)
        .sort()
        .reduce((resultingObject, key) => {
            resultingObject[key] = obj[key];
            return resultingObject;
        }, {} as {[key: string]: any});
}

function removeUnknownTitles(obj: {[key: string]: any}) {
    if (allTestTitlesMap == null) {
        allTestTitlesMap = readAllTestTitlesMapFromDirectory(testsDirectory);
    }

    const currentObjectKeys = Object.keys(obj);
    for (let i = 0; i < currentObjectKeys.length; i++) {
        const key = currentObjectKeys[i];
        if (!allTestTitlesMap[key]) {
            delete obj[key];
        }
    }
}

function readAllTestTitlesMapFromDirectory(directory: string): {[key: string]: boolean} {
    //1. iterate over test directory and for each file in order to get matched patterns
    const allFilePaths = getAllFilesFromDirectory(directory);

    //2. get all test titles from patterns
    const itTestTilePattern = new RegExp(/it\s?\(\s?(?<title>(".*")|(`.*`)|('.*')?)\s?,/g);

    const allTestTitles = allFilePaths.map(filePath => {
        const fileContent = fs.readFileSync(filePath);
        const fileContentAsString = fileContent.toString();
        const matchIterator = fileContentAsString.matchAll(itTestTilePattern);

        const titles: string[] = [];

        let isDone = false;
        while (!isDone) {
            const iterationResult = matchIterator.next();
            const iterationValue = iterationResult.value;
            const title = iterationValue?.groups?.title;
            if (title) {
                const sanitizedTitle = title.substring(1, title.length - 1);
                titles.push(sanitizedTitle);
            }

            isDone = iterationResult.done;
        }

        return titles;
    })
        .flatMap(matchArray => matchArray);

    //3. save them as map in order to speed up reads
    return Object.fromEntries(allTestTitles.map(title => [title, true]));
}

function getAllFilesFromDirectory(directoryPath: string, files: string[] = []) {
    const fileList = fs.readdirSync(directoryPath);

    for (const file of fileList) {
        const name = `${directoryPath}/${file}`;

        if (fs.statSync(name).isDirectory()) {
            getAllFilesFromDirectory(name, files);
        } else {
            files.push(name);
        }
    }

    return files;
}

function getJsonObjectFromFileData(fileData: Buffer): {[key: string]: any} | null {
    try {
        // JSON.parse is able to parse buffer, ts just doesn't know about it
        // @ts-ignore
        return JSON.parse(fileData);
    } catch (e) {
        return null;
    }
}
