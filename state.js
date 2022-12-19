const getUsername = () => {
    const args = process.argv.splice(2);
    const idx = args.findIndex((arg) => arg === "--username");
    return args[idx + 1];
};

export const state = {
    username: getUsername() ?? "Someone",
    currentDirectory: process.cwd(),
};
