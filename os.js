import os from "os";
import { InvalidInputError } from "./errors.js";

export const osCommand = async (args) => {
    try {
        switch (args[0]) {
            case "--EOL":
                console.log(JSON.stringify(os.EOL));
                break;
            case "--cpus":
                console.log(
                    os.cpus().map((cpu) => {
                        return {
                            model: cpu.model,
                            speed: cpu.speed,
                        };
                    })
                );
                break;
            case "--homedir":
                console.log(os.homedir());
                break;
            case "--username":
                console.log(os.userInfo().username);
                break;
            case "--architecture":
                console.log(os.arch());
                break;
            default:
                console.log("Invalid input");
                break;
        }
    } catch (error) {
        throw new InvalidInputError();
    }
};
