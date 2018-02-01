#!/usr/bin/env node

'use strict';

const BurnInit = require('../init');

new BurnInit(process.cwd(), process.argv.slice(2)).run();