const { cleanModels } = require('../../utils/testing');
const User = require('./user.model');
const db = require('../../db');

describe('User Model', () => {
  before(() => db.connect().then(cleanModels));
  after(() => db.connection.close());

  afterEach(() => cleanModels());

  it('should start with no users', () => User.find().should.eventually.have.length(0));
});
