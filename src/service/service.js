'use strict';

const {Cli} = require(`./cli`);

const userArguments = process.argv.slice(2);
const [userCommand] = userArguments;
const ExitCode = {
  error: 1,
  success: 0,
}

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[`--version`].run();
  process.exit(ExitCode.success);
}

Cli[userCommand].run(userArguments.slice(1));
