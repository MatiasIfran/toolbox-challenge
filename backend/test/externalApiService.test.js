const { expect } = require('chai');
const nock = require('nock');
const { EXTERNAL_API_BASE_URL } = require('../src/config/config');
const { listFiles, downloadFile } = require('../src/services/externalApiService');

describe('externalApiService', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('listFiles', () => {
    it('returns the file list on success', async () => {
      nock(EXTERNAL_API_BASE_URL)
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv', 'file2.csv'] });

      const files = await listFiles();

      expect(files).to.deep.equal(['file1.csv', 'file2.csv']);
    });

    it('throws when the external API returns an error', async () => {
      const scope = nock(EXTERNAL_API_BASE_URL).get('/v1/secret/files').reply(500);

      try {
        await listFiles();
        expect.fail('expected listFiles to throw');
      } catch (err) {
        expect(err.message).to.equal('Failed to list files: 500 Internal Server Error');
      }

      expect(scope.isDone()).to.be.true;
    });
  });

  describe('downloadFile', () => {
    it('returns the file content on the first successful attempt', async () => {
      const scope = nock(EXTERNAL_API_BASE_URL)
        .get('/v1/secret/file/file1.csv')
        .reply(200, 'file,text,number,hex');

      const content = await downloadFile('file1.csv');

      expect(content).to.equal('file,text,number,hex');
      expect(scope.isDone()).to.be.true;
    });

    it('retries on a 500 and succeeds on the second attempt', async () => {
      const scope = nock(EXTERNAL_API_BASE_URL)
        .get('/v1/secret/file/file1.csv')
        .reply(500)
        .get('/v1/secret/file/file1.csv')
        .reply(200, 'ok content');

      const content = await downloadFile('file1.csv');

      expect(content).to.equal('ok content');
      expect(scope.isDone()).to.be.true;
    });

    it('retries on a 429 and succeeds on the second attempt', async () => {
      const scope = nock(EXTERNAL_API_BASE_URL)
        .get('/v1/secret/file/file1.csv')
        .reply(429)
        .get('/v1/secret/file/file1.csv')
        .reply(200, 'ok content');

      const content = await downloadFile('file1.csv');

      expect(content).to.equal('ok content');
      expect(scope.isDone()).to.be.true;
    });

    it('does not retry on a 404', async () => {
      const scope = nock(EXTERNAL_API_BASE_URL).get('/v1/secret/file/missing.csv').reply(404);

      try {
        await downloadFile('missing.csv');
        expect.fail('expected downloadFile to throw');
      } catch (err) {
        expect(err.message).to.equal('Failed to download file "missing.csv": 404 Not Found');
      }

      expect(scope.isDone()).to.be.true;
    });

    it('retries on a network error and succeeds on the second attempt', async () => {
      const scope = nock(EXTERNAL_API_BASE_URL)
        .get('/v1/secret/file/file1.csv')
        .replyWithError('socket hang up')
        .get('/v1/secret/file/file1.csv')
        .reply(200, 'recovered content');

      const content = await downloadFile('file1.csv');

      expect(content).to.equal('recovered content');
      expect(scope.isDone()).to.be.true;
    });

    it('fails after exhausting every attempt on repeated 500s', async () => {
      const scope = nock(EXTERNAL_API_BASE_URL).get('/v1/secret/file/file1.csv').times(3).reply(500);

      try {
        await downloadFile('file1.csv');
        expect.fail('expected downloadFile to throw');
      } catch (err) {
        expect(err.message).to.equal('Failed to download file "file1.csv": 500 Internal Server Error');
      }

      expect(scope.isDone()).to.be.true;
    });
  });
});
