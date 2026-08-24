const { expect } = require('chai');
const { parseCsv } = require('../src/services/csvParserService');

describe('csvParserService.parseCsv', () => {
  it('parses valid rows into the expected schema', () => {
    const content = [
      'file,text,number,hex',
      'file1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765',
      'file1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5'
    ].join('\n');

    expect(parseCsv('file1.csv', content)).to.deep.equal({
      file: 'file1.csv',
      lines: [
        { text: 'RgTya', number: 64075909, hex: '70ad29aacf0b690b0467fe2b2767f765' },
        { text: 'AtjW', number: 6, hex: 'd33a8ca5d36d3106219f66f939774cf5' }
      ]
    });
  });

  it('returns an empty lines array for an empty file', () => {
    expect(parseCsv('empty.csv', '')).to.deep.equal({ file: 'empty.csv', lines: [] });
  });

  it('returns an empty lines array for a header-only file', () => {
    expect(parseCsv('onlyheader.csv', 'file,text,number,hex')).to.deep.equal({
      file: 'onlyheader.csv',
      lines: []
    });
  });

  it('discards a line with fewer columns than expected', () => {
    const content = 'file,text,number,hex\nfile1.csv,short,1';
    expect(parseCsv('file1.csv', content).lines).to.deep.equal([]);
  });

  it('discards a line with an empty number', () => {
    const content = 'file,text,number,hex\nfile1.csv,hello,,70ad29aacf0b690b0467fe2b2767f765';
    expect(parseCsv('file1.csv', content).lines).to.deep.equal([]);
  });

  it('discards a line with a non-numeric number', () => {
    const content = 'file,text,number,hex\nfile1.csv,hello,notanumber,70ad29aacf0b690b0467fe2b2767f765';
    expect(parseCsv('file1.csv', content).lines).to.deep.equal([]);
  });

  it('discards a line with an invalid hex value', () => {
    const content = 'file,text,number,hex\nfile1.csv,hello,5,zz';
    expect(parseCsv('file1.csv', content).lines).to.deep.equal([]);
  });

  it('discards a line with an empty text value', () => {
    const content = 'file,text,number,hex\nfile1.csv,,5,70ad29aacf0b690b0467fe2b2767f765';
    expect(parseCsv('file1.csv', content).lines).to.deep.equal([]);
  });

  it('keeps valid lines and discards invalid ones from the same file', () => {
    const content = [
      'file,text,number,hex',
      'file1.csv,short,1',
      'file1.csv,ok,5,70ad29aacf0b690b0467fe2b2767f765'
    ].join('\n');

    expect(parseCsv('file1.csv', content).lines).to.deep.equal([
      { text: 'ok', number: 5, hex: '70ad29aacf0b690b0467fe2b2767f765' }
    ]);
  });
});
