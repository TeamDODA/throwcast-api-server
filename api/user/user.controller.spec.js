const { cleanModels } = require('../../utils/testing');
const db = require('../../db');
const proxyquire = require('proxyquire');
const { mockReq, mockRes } = require('sinon-express-mock');

const token = 'SOME_TOKEN';
const userRecord = {
  username: 'username1',
  password: 'password1',
};

describe('User Controller', () => {
  before(() => db.connect().then(cleanModels));
  after(() => db.connection.close());

  let controller;
  let signToken;
  let validationError;
  let handleError;
  beforeEach(done => {
    signToken = sinon.stub().returns(token);
    validationError = sinon.stub();
    handleError = sinon.stub();
    controller = proxyquire('./user.controller', {
      '../../utils': { validationError, handleError },
      '../../auth/auth.service': { signToken },
    });
    done();
  });
  afterEach(() => cleanModels());

  describe('#create', () => {
    describe('with valid req.body', () => {
      const req = mockReq({ body: userRecord });
      const res = mockRes();

      it('should signToken and send response with token', () => controller.create(req, res)
        .then(() => signToken.should.be.calledOnce)
        .then(() => res.json.should.be.calledWith({ token })));
    });

    describe('with invalid req.body', () => {
      const req = mockReq({ body: {} });
      const res = mockRes();

      it('should be rejected with ValidationError', () => controller.create(req, res)
        .should.eventually.be.rejected
        .and.have.property('name', 'ValidationError')
        .then(() => signToken.should.not.be.called));
    });
  });
});
