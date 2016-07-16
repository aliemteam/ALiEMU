module.exports = function (wallaby) {
    return {
        files: [
            'aliem/**/*.{ts,tsx}',
            '!aliem/**/__tests__/*',
            'node_modules/@types/**/index.d.ts',
            'lib/**/*.{ts,tsx}',
        ],
        tests: [
            'aliem/**/__tests__/*-test.{ts,tsx}',
        ],
        env: {
            type: 'node',
            runner: 'node',
        },
        testFramework: 'jest',
        bootstrap: function (wallaby) {
            wallaby.testFramework.configure({
                'scriptPreprocessor': 'jestPreprocessor.js',
                'testRegex': '__tests__/.*\.(js|ts|tsx)$',
                'moduleFileExtensions': [
                  'js',
                  'ts',
                  'tsx',
                  'json'
                ],
                'unmockedModulePathPatterns': [
                  'react',
                  'react-dom',
                  'react-addons-test-utils',
                  'enzyme',
                  'sinon',
                  '<rootDir>/lib/utils/Fixtures',
                ],
            });
        }
    };
};
