const db = require('../../db');
const User = require('./user.model');

describe('User Model', () => {
  const cleanModels = () => User.remove();

  before(() => db.connect().then(cleanModels));
  after(() => db.connection.close());

  afterEach(cleanModels);

  it('should start with no users', () => User.find().should.eventually.have.length(0));
});
