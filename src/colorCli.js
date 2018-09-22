const colors = require('colors/safe');

module.exports = {
    info: (v) => {
        console.log(colors.cyan(v));
    },
    debug: (v) => {
        console.log(colors.green(v));
    },
    warn: (v) => {
        console.log(colors.red(v));
    },
    error: (v) => {
        console.log(colors.red.underline(v));
    }
};
