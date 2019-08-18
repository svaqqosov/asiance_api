const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

const expect = chai.expect;
const should = chai.should();
let author;
let authorId = null;
chai.use(chaiHttp);

describe('AUTHOR API TESTS', () => {
  describe('/POST AUTHOR', () => {
    it('it should CREATE an Author ', (done) => {
      author = {
        name: 'Karim Benzema',
        role: 'footballer'
      };
      chai.request(app)
        .post('/authors')
        .send(author)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('name');
          res.body.data.should.have.property('role');
          authorId = res.body.data.id;
          done();
        });
    });
  });
  describe('/PUT AUTHOR', () => {
    it('it should UPDATE an author ', (done) => {
      author = {
        name: 'Cristiano Ronaldo',
        role: 'footballer'
      };
      chai.request(app)
        .put(`/authors/${authorId}`)
        .send(author)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('name');
          res.body.data.should.have.property('role');
          authorId = res.body.data.id;
          done();
        });
    });
  });
  /*
  * Test the /GET route
  */
  describe('/GET AUTHORS', () => {
    it('it should GET list of the authors', (done) => {
      chai.request(app)
        .get('/authors')
        .end((err, res) => {
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.have.property('items');
          res.body.data.items.should.be.a('array');
          done();
        });
    });
  });

  describe('/DELETE AUTHORS', () => {
    it('it should DELETE an author ', (done) => {
      chai.request(app)
        .delete(`/authors/${authorId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.have.property('id');
          done();
        });
    });
  });
});
