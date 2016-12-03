module.exports = {
    files: [
        './aliemu/**/*.{ts,tsx}',
        './lib/typings/*.d.ts',
        './package.json',
        {
            pattern: './lib/utils/*.{ts,js}',
            instrument: false,
        },
        '!./aliemu/**/__tests__/*',
    ],
    tests: [
        './aliemu/**/__tests__/*-test.{ts,tsx}',
    ],
    env: {
        type: 'node',
        runner: 'node',
    },
    testFramework: 'jest',
    setup(wallaby) {
        wallaby.testFramework.configure(require('./package.json').jest); // eslint-disable-line
    },
};
