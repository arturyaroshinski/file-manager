import fs from "fs";
import path from "path";
import { state } from "./state.js";
import { InvalidInputError } from "./errors.js";

export const addCommand = async (args) => {
    try {
        await fs.promises.writeFile(
            path.resolve(state.currentDirectory, args[0]),
            ""
        );
    } catch (error) {
        throw new InvalidInputError();
    }
};
