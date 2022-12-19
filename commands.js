import fs from "fs";
import zlib from "zlib";
import crypto from "crypto";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import { state } from "./state.js";
import { InvalidInputError } from "./errors.js";
import { cdCommand } from "./cd.js";
import { catCommand } from "./cat.js";
import { lsCommand } from "./ls.js";
import { osCommand } from "./os.js";
import { addCommand } from "./add.js";
const pipe = promisify(pipeline);

export const commands = {
    cd: cdCommand,
    up: async () => await commands.cd([".."]),
    cat: catCommand,
    rn: async (args) => {
        try {
            if (args.length < 2) throw new Error();
            await fs.promises.rename(args[0], args[1]);
        } catch (error) {
            throw new InvalidInputError();
        }
    },
    add: addCommand,
    ls: lsCommand,
    cp: async (args) => {
        try {
            if (args.length < 2) throw new Error();
            const reader = fs.createReadStream(
                path.resolve(state.currentDirectory, args[0])
            );

            const writer = fs.createWriteStream(
                path.resolve(state.currentDirectory, args[1])
            );

            reader.pipe(writer);
        } catch (error) {
            throw new InvalidInputError();
        }
    },
    mv: async (args) => {
        const [filepath, dir] = args;
        await commands.cp([
            filepath,
            path.resolve(dir, path.basename(filepath)),
        ]);
        try {
            await fs.promises.unlink(
                path.resolve(state.currentDirectory, args[0])
            );
        } catch (error) {
            throw new InvalidInputError();
        }
    },
    rm: async (args) => {
        await fs.promises.unlink(path.resolve(state.currentDirectory, args[0]));
    },
    os: osCommand,
    hash: async (args) => {
        try {
            const fileBuffer = await fs.promises.readFile(
                path.resolve(state.currentDirectory, args[0])
            );

            const hash = crypto
                .createHash("sha256")
                .update(fileBuffer)
                .digest("hex");

            console.log(hash);
        } catch {
            throw new InvalidInputError();
        }
    },
    compress: async (args) => {
        try {
            const readableStream = fs.createReadStream(
                path.resolve(state.currentDirectory, args[0])
            );
            const writebleStream = fs.createWriteStream(
                path.resolve(state.currentDirectory, args[1])
            );

            const zipStream = zlib.createBrotliCompress();

            await pipe(readableStream, zipStream, writebleStream);
        } catch {
            throw new InvalidInputError();
        }
    },
    decompress: async (args) => {
        try {
            const readableStream = fs.createReadStream(
                path.resolve(state.currentDirectory, args[0])
            );
            const writebleStream = fs.createWriteStream(
                path.resolve(state.currentDirectory, args[1])
            );

            const unzipStream = zlib.createBrotliDecompress();
            await pipe(readableStream, unzipStream, writebleStream);
        } catch {
            throw new InvalidInputError();
        }
    },
};
