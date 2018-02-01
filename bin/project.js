#!/usr/bin/env node

'use strict';

const BurnInit = require('../init');

new BurnInit().run(process.cwd(), process.argv.slice(2));