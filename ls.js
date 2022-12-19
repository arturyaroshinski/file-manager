import fs from "fs";
import path from "path";
import { state } from "./state.js";
import { InvalidInputError } from "./errors.js";

export const lsCommand = async () => {
    try {
        const dir = await fs.promises.readdir(state.currentDirectory);
        const filesInfo = await Promise.allSettled(
            dir.map(async (fileName) => {
                const filePath = path.resolve(state.currentDirectory, fileName);
                const stat = await fs.promises.stat(filePath);
                return {
                    fileName,
                    type: stat.isFile() ? "file" : "directory",
                };
            })
        );

        const sorted = filesInfo
            .filter((fileInfo) => fileInfo.value)
            .map((fileInfo) => fileInfo.value)
            .sort((a, b) => {
                if (a.type > b.type) return 1;
                if (a.type < b.type) return -1;

                return a.fileName.localeCompare(b.fileName);
            });

        console.table(sorted);
    } catch (error) {
        throw new InvalidInputError();
    }
};
