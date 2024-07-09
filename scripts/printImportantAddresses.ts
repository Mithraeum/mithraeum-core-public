const fs = require("fs");

function readDeploymentAddress(deploymentName: string, name: string): string {
    const file = fs.readFileSync(`../mithraeum-core-contracts/deployments/${deploymentName}/${name}.json`);
    const parsedFile = JSON.parse(file);
    return parsedFile.address;
}

function main() {
    const importantDeploymentContracts = [
        "BannerParts",
        "ArmyView",
        "SettlementView",
        "SettlementsListings",
        "EraView"
    ];

    const deploymentName = process.argv[2];

    const importantDeploymentContractsAddresses = importantDeploymentContracts.map(name => {
        return [name, readDeploymentAddress(deploymentName, name)];
    })

    console.log(Object.fromEntries(importantDeploymentContractsAddresses));
}

main();