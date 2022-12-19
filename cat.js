import path from "path";
import fs from "fs";
import os from "os";
import { state } from "./state.js";
import { InvalidInputError } from "./errors.js";

export const catCommand = async (args) => {
    try {
        return new Promise((res) => {
            const filePath = path.resolve(state.currentDirectory, args[0]);
            const rs = fs.createReadStream(filePath);
            rs.pipe(process.stdout);
            rs.on("end", () => {
                res();
                console.log(os.EOL);
            });
        });
    } catch (error) {
        throw new InvalidInputError();
    }
};
