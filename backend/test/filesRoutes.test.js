const { expect } = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const app = require('../src/app');
const filesService = require('../src/services/filesService');

describe('GET /files/data', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('responds with 200, application/json and the files data', async () => {
    const data = [
      { file: 'file1.csv', lines: [{ text: 'RgTya', number: 64075909, hex: '70ad29aacf0b690b0467fe2b2767f765' }] }
    ];
    sinon.stub(filesService, 'getFilesData').resolves(data);

    const response = await request(app).get('/files/data');

    expect(response.status).to.equal(200);
    expect(response.headers['content-type']).to.match(/application\/json/);
    expect(response.body).to.deep.equal(data);
  });

  it('responds with 500 and a JSON error body when getFilesData fails', async () => {
    sinon.stub(filesService, 'getFilesData').rejects(new Error('Failed to list files: 500 Internal Server Error'));

    const response = await request(app).get('/files/data');

    expect(response.status).to.equal(500);
    expect(response.headers['content-type']).to.match(/application\/json/);
    expect(response.body).to.deep.equal({ error: 'Internal server error' });
  });
});
