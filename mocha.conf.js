const chai = require('chai');
const logger = require('winston');

logger.remove(logger.transports.Console);

global.expect = chai.expect;
global.assert = chai.assert;
chai.should();

global.sinon = require('sinon');

chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));
chai.use(require('chai-things'));
