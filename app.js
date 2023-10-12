import express from 'express';
import fs from 'fs';
import config from './config.js';
import { monitor } from './monitor.js';

const app = express();
const port = 3000;

const results = [];

const monitorSites = async () => {
  fs.appendFileSync(config.logFile, `${new Date().toLocaleString()}\n`);
  const monitoringResults = await Promise.all(config.sites.map(site => monitor(site)));
  
  //write to logs
  monitoringResults.map(result => (
    fs.appendFileSync(config.logFile, `${result.url} - Status: ${result.status}, Response Time: ${result.responseTime}ms\n`)
  ));

  //add to results array 
  results.push({
    timestamp: new Date().toLocaleString(),
    results: monitoringResults,
  });
};

// Initial check
monitorSites();

// Schedule periodic monitoring
setInterval(monitorSites, config.checkInterval);


app.get('/', (req, res) => {
  const mostRecentResults = results.slice(-1)[0];
  const timestamp = mostRecentResults.timestamp;
  const monitoringResults = mostRecentResults.results;

  const html = `
    <html>
      <head>
        <title>site Monitoring</title>
      </head>
      <body>
        <h1>Website Monitoring</h1>
        <p><strong></strong> ${timestamp}</p>
          ${monitoringResults.map(siteResult => `
              <strong>URL:</strong> ${siteResult.url}<br>
              <strong>Status:</strong> ${siteResult.status}<br>
              <strong>Response Time:</strong> ${siteResult.responseTime} ms
              </br></br>
          `).join('')}
      </body>
    </html>
  `;

  res.send(html);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
