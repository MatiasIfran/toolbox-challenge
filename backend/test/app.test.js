const { expect } = require('chai')
const request = require('supertest')
const app = require('../src/app')

describe('GET /', () => {
  it('responds with 200 and a status ok payload', async () => {
    const response = await request(app).get('/')

    expect(response.status).to.equal(200)
    expect(response.headers['content-type']).to.match(/application\/json/)
    expect(response.body).to.deep.equal({ status: 'ok' })
  })
})
