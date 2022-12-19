import { state } from "./state.js";
import path from "path";
import fs from "fs";
import { InvalidInputError } from "./errors.js";

export const cdCommand = async (args) => {
    try {
        const candidatePath = args[0];
        const cdPath = path.resolve(state.currentDirectory, candidatePath);

        await fs.promises.access(cdPath);
        const stat = await fs.promises.lstat(cdPath);
        if (!stat.isDirectory()) return;

        state.currentDirectory = cdPath;
    } catch (error) {
        throw new InvalidInputError();
    }
};
