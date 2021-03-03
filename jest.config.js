module.exports = {
    collectCoverage: true,
    roots: ["<rootDir>"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "test/.*(feature|test|spec).tsx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "mjs", "json"],
    moduleNameMapper: {
        "^src/(.*)": "<rootDir>/src/$1",
    },
    moduleDirectories: ["node_modules", "src/node_modules"],
    testEnvironment: "node",
};
