const { expect } = require('chai');
const app = require('../src/app');

describe('app', () => {
  it('exports an Express application', () => {
    expect(app).to.be.a('function');
  });
});
