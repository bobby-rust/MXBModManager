import { Mod, ModsData } from "../../types/types";
import fs from "fs";
import path from "path";

export function loadMods(): ModsData {
	const filePath = path.join("data", "mods.json");
	const modsDataFileContents = fs.readFileSync(filePath, "utf-8").trim();
	const modsDataObject = JSON.parse(modsDataFileContents);

	const modsData: ModsData = new Map<string, Mod>();

	Object.entries(modsDataObject).forEach(([key, value]) => {
		modsData.set(key, value as Mod);
	});

	return modsData;
}
