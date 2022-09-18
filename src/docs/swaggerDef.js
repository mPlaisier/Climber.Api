const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Climber Api documentation',
    version,
    license: {
      name: 'GNU General Public License v3.0',
      url: 'https://github.com/mPlaisier/Climber.Api/blob/develop/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
