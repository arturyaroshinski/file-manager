import { EOL } from "os";
import { commands } from "./commands.js";
import { state } from "./state.js";
import { InvalidInputError } from "./errors.js";

const parse = (input) => input.trim().replace(EOL, "").split(" ");

console.log(`Welcome to the File Manager, ${state.username}!`);
console.log(state.currentDirectory);

const handleInput = async (input) => {
    const [commandName, ...args] = parse(input.toString());
    if (commandName === ".exit") process.exit(0);
    if (commands[commandName]) {
        try {
            await commands[commandName](args);
        } catch (error) {
            if (error instanceof InvalidInputError) {
                console.log(error.message);
            }
        }
        console.log(`You are currently in ${state.currentDirectory}`);
    } else {
        console.log("Unknown command");
    }
};

function handleExit(options) {
    if (options.cleanup) {
        console.log(
            `Thank you for using File Manager, ${state.username}, goodbye!`
        );
    }
    if (options.exit) process.exit();
}

process.stdin.on("data", handleInput);
process.on("exit", handleExit.bind(null, { cleanup: true }));
process.on("SIGINT", handleExit.bind(null, { exit: true }));
