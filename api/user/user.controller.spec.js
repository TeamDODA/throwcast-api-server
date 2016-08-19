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
  let utilsStub;
  beforeEach(done => {
    signToken = sinon.stub().returns(token);
    utilsStub = {
      validationError: sinon.stub().returns(sinon.spy()),
      handleError: sinon.stub().returns(sinon.spy()),
      respondWithResult: sinon.stub().returns(sinon.spy()),
    };

    controller = proxyquire('./user.controller', {
      '../../utils': utilsStub,
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
        .then(() => utilsStub.respondWithResult().should.be.calledWith({ token })));
    });

    describe('with invalid req.body', () => {
      const req = mockReq({ body: {} });
      const res = mockRes();

      it('should be rejected with ValidationError', () => controller.create(req, res)
        .then(() => signToken.should.not.be.called)
        .then(() => utilsStub.validationError().should.be.calledOnce));
    });
  });
});
