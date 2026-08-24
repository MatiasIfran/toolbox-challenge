const { expect } = require('chai');
const sinon = require('sinon');
const externalApiService = require('../src/services/externalApiService');
const csvParserService = require('../src/services/csvParserService');
const { getFilesList, getFilesData } = require('../src/services/filesService');

describe('filesService.getFilesList', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('returns the file list from the external API as-is', async () => {
    sinon.stub(externalApiService, 'listFiles').resolves(['file1.csv', 'file2.csv']);

    const result = await getFilesList();

    expect(result).to.deep.equal(['file1.csv', 'file2.csv']);
  });

  it('propagates the error when listing files fails', async () => {
    sinon
      .stub(externalApiService, 'listFiles')
      .rejects(new Error('Failed to list files: 500 Internal Server Error'));

    try {
      await getFilesList();
      expect.fail('expected getFilesList to throw');
    } catch (err) {
      expect(err.message).to.equal('Failed to list files: 500 Internal Server Error');
    }
  });
});

describe('filesService.getFilesData', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('downloads and parses every listed file', async () => {
    sinon.stub(externalApiService, 'listFiles').resolves(['file1.csv', 'file2.csv']);
    sinon.stub(externalApiService, 'downloadFile').callsFake((file) => {
      if (file === 'file1.csv') {
        return Promise.resolve(
          'file,text,number,hex\nfile1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765'
        );
      }
      return Promise.resolve('file,text,number,hex\nfile2.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5');
    });

    const result = await getFilesData();

    expect(result).to.deep.equal([
      { file: 'file1.csv', lines: [{ text: 'RgTya', number: 64075909, hex: '70ad29aacf0b690b0467fe2b2767f765' }] },
      { file: 'file2.csv', lines: [{ text: 'AtjW', number: 6, hex: 'd33a8ca5d36d3106219f66f939774cf5' }] }
    ]);
  });

  it('downloads only the requested file when fileName is given, without listing all files', async () => {
    const listFiles = sinon.stub(externalApiService, 'listFiles');
    sinon
      .stub(externalApiService, 'downloadFile')
      .withArgs('file1.csv')
      .resolves('file,text,number,hex\nfile1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765');

    const result = await getFilesData('file1.csv');

    expect(result).to.deep.equal([
      { file: 'file1.csv', lines: [{ text: 'RgTya', number: 64075909, hex: '70ad29aacf0b690b0467fe2b2767f765' }] }
    ]);
    expect(listFiles.called).to.be.false;
  });

  it('skips a file whose download fails and keeps processing the rest', async () => {
    sinon.stub(externalApiService, 'listFiles').resolves(['file1.csv', 'file2.csv', 'file3.csv']);
    sinon.stub(externalApiService, 'downloadFile').callsFake((file) => {
      if (file === 'file2.csv') {
        return Promise.reject(new Error('Failed to download file "file2.csv": 500 Internal Server Error'));
      }
      return Promise.resolve(`file,text,number,hex\n${file},t,1,70ad29aacf0b690b0467fe2b2767f765`);
    });

    const result = await getFilesData();

    expect(result.map((r) => r.file)).to.deep.equal(['file1.csv', 'file3.csv']);
  });

  it('propagates the error when listing files fails', async () => {
    sinon
      .stub(externalApiService, 'listFiles')
      .rejects(new Error('Failed to list files: 500 Internal Server Error'));

    try {
      await getFilesData();
      expect.fail('expected getFilesData to throw');
    } catch (err) {
      expect(err.message).to.equal('Failed to list files: 500 Internal Server Error');
    }
  });

  it('does not swallow an unexpected error thrown by the parser', async () => {
    sinon.stub(externalApiService, 'listFiles').resolves(['file1.csv']);
    sinon
      .stub(externalApiService, 'downloadFile')
      .resolves('file,text,number,hex\nfile1.csv,t,1,70ad29aacf0b690b0467fe2b2767f765');
    sinon.stub(csvParserService, 'parseCsv').throws(new TypeError('boom'));

    try {
      await getFilesData();
      expect.fail('expected getFilesData to throw');
    } catch (err) {
      expect(err).to.be.instanceOf(TypeError);
      expect(err.message).to.equal('boom');
    }
  });
});
