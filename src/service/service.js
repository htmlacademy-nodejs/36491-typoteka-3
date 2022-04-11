'use strict';

const {Cli} = require(`./cli`);
const {ExitCode} = require(`../consts`);
const userArguments = process.argv.slice(2);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[`--version`].run();
  process.exit(ExitCode.success);
}

Cli[userCommand].run(userArguments.slice(1));
