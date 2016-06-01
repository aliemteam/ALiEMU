module.exports = function (wallaby) {
    return {
        files: [
            "wp-content/**/*.tsx",
            "wp-content/**/*.ts",
            "typings/**/*.d.ts",
            "!wp-content/**/__tests__/*",
        ],
        tests: [
            "wp-content/**/__tests__/*-test.tsx",
            "wp-content/**/__tests__/*-test.ts",
        ],
        env: {
            type: 'node',
            runner: 'node',
        },
        testFramework: "jest",
        bootstrap: function (wallaby) {
            wallaby.testFramework.configure({
                "scriptPreprocessor": "jestPreprocessor.js",
                "testFileExtensions": [
                  "ts",
                  "tsx",
                  "js"
                ],
                "moduleFileExtensions": [
                  "js",
                  "ts",
                  "tsx",
                  "json"
                ],
                "unmockedModulePathPatterns": [
                  "react",
                  "react-dom",
                  "react-addons-test-utils",
                  "enzyme",
                  "sinon",
                ],
            });
        }
    };
};
