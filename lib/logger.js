"use strict";

module.exports = class Log {
    blue(str) {
        console.log(`error:\x1b[34m ${str}\x1b[0m`);
    }
    green(str) {
        console.log(`\x1b[32m${str}\x1b[0m`);
    }
}
