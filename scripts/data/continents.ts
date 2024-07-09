import {Continent} from "../types/continent";
import {regions} from "./regions";

// Currently there is 10 regions in 'regions.ts'
const filteredRegions = regions.filter((region, index) => index < 1);

export const continent = new Continent([...filteredRegions]);
