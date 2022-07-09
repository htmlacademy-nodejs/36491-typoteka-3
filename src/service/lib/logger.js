'use strict';

const pino = require(`pino`);
const {Env} = require(`../../consts`);

const LOG_FILE = `./logs/api.log`;
const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
const defaultLogLevel = isDevMode ? `info` : `error`;

const pinoConfig = {
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
};

if (isDevMode) {
  pinoConfig.transport = {
    target: `pino-pretty`,
  };
}

const logger = pino(pinoConfig, isDevMode ? process.stdout : pino.destination(LOG_FILE));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
