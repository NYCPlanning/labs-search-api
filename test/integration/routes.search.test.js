const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(require('chai-things'));

const should = chai.should();

chai.use(chaiHttp);

const server = require('../../app');

describe('GET /search', () => {
  it('should respond with searches that match the specified address', (done) => {
    chai.request(server)
      .get('/search?helpers[]=geosearch&helpers[]=neighborhood&helpers[]=bbl&helpers[]=zoning-district&helpers[]=zoning-map-amendment&helpers[]=special-purpose-district&helpers[]=commercial-overlay&q=120%20broadway')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');

        done();
      });
  });
});

it('test geosearch only', (done) => {
  chai.request(server)
    .get('/search/geosearch?q=120 Broadway')
    .end((err, res) => {
      should.not.exist(err);
      res.status.should.equal(200);
      res.type.should.equal('application/json');

      done();
    });
});

it('test city-map-alteration only', (done) => {
  chai.request(server)
    .get('/search/city-map-alteration?q=120 Broadway')
    .end((err, res) => {
      should.not.exist(err);
      res.status.should.equal(200);
      res.type.should.equal('application/json');

      done();
    });
});

it('test city-map-street-search only', (done) => {
  chai.request(server)
    .get('/search/city-map-street-search?q=120 Broadway')
    .end((err, res) => {
      should.not.exist(err);
      res.status.should.equal(200);
      res.type.should.equal('application/json');

      done();
    });
});

it('test commercial-overlay only', (done) => {
  chai.request(server)
    .get('/search/commercial-overlay?q=120 Broadway')
    .end((err, res) => {
      should.not.exist(err);
      res.status.should.equal(200);
      res.type.should.equal('application/json');

      done();
    });
});

it('test neighborhood only', (done) => {
  chai.request(server)
    .get('/search/neighborhood?q=120 Broadway')
    .end((err, res) => {
      should.not.exist(err);
      res.status.should.equal(200);
      res.type.should.equal('application/json');

      done();
    });
});

it('test special-purpose-district only', (done) => {
  chai.request(server)
    .get('/search/special-purpose-district?q=120 Broadway')
    .end((err, res) => {
      should.not.exist(err);
      res.status.should.equal(200);
      res.type.should.equal('application/json');

      done();
    });
});

it('test zoning-district only', (done) => {
  chai.request(server)
    .get('/search/zoning-district?q=120 Broadway')
    .end((err, res) => {
      should.not.exist(err);
      res.status.should.equal(200);
      res.type.should.equal('application/json');

      done();
    });
});

it('test zoning-map-amendment only', (done) => {
  chai.request(server)
    .get('/search/zoning-map-amendment?q=120 Broadway')
    .end((err, res) => {
      should.not.exist(err);
      res.status.should.equal(200);
      res.type.should.equal('application/json');

      done();
    });
});
