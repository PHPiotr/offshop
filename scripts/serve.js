'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const getClientEnvironment = require('../config/env');
const path = require('path');
const childProcess = require('child_process');

getClientEnvironment(path.resolve('../'));

childProcess.exec(`ssh -o ServerAliveInterval=${process.env.SERVER_ALIVE_INTERVAL} -R ${process.env.DOMAIN_NAME}.serveo.net:80:localhost:${process.env.PORT} serveo.net`);
