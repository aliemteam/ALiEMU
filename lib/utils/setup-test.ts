// tslint:disable:no-var-requires
require('ts-node/register');
const { toMatchDiffSnapshot } = require('snapshot-diff');

expect.extend({ toMatchDiffSnapshot });

Object.defineProperties(window, {
    alert: {
        value(): void {
            return void 0;
        },
    },
});

