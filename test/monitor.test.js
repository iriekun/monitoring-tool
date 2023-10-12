import { expect } from 'chai';
import axios from 'axios'; 
import sinon from 'sinon';
import { monitor } from '../monitor.js';

describe('monitor function', () => {
  const site = {
    url: 'https://foobar.com/login',
    contentRequirement: 'Please login',
  };

  it('handles a successful response', async () => {
    // Mock axios for testing
    sinon.stub(axios, 'get').resolves({ data: 'Please login' });
    const result = await monitor(site);

    expect(result.url).to.equal(site.url);
    expect(result.status).to.equal('OK');

    // Restore the original axios.get function
    axios.get.restore();
  });

  it('handles a content mismatch', async () => {
    // Mock axios for testing
    sinon.stub(axios, 'get').resolves({ data: 'Some Content' });
    const result = await monitor(site);

    expect(result.url).to.equal(site.url);
    expect(result.status).to.equal('Content mismatch');

    // Restore the original axios.get function
    axios.get.restore();
  });

  it('handles an error', async () => {
    // Mock axios for testing
    sinon.stub(axios, 'get').rejects(new Error('404 Error'));
    const result = await monitor(site);

    expect(result.url).to.equal(site.url);
    expect(result.status).to.be.an('error');

    // Restore the original axios.get function
    axios.get.restore();
  });
});
