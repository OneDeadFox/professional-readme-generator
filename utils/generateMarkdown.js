const fs = require('fs');
var globalDirectory;

function fetchLicense(url, directory){ 
  globalDirectory = directory; 
  if(url != 'None'){
      fetch(url)
          .then(function(response){
              return response.json();
          })
          .then(function(data){
              const badgeName = data.spdx_id.replace(/-/g, '_');
            
              renderLicenseBadge(badgeName, data.html_url, data.description);
              generateMarkdown(data.body);
          })
      } else {
        console.log('No license has been provided for this application.')
        }
}

function renderLicenseBadge(license, link, description) {
    fs.appendFile(`./docs/${globalDirectory}-docs/README.md`, `[![License](https://img.shields.io/badge/License-${license}-blue.svg)](${link})\n${description}\n\n\n`, function(err){
      if(err){
          console.log(err)
      }
  });
}

function generateMarkdown(data) {
    fs.writeFile(`./docs/${globalDirectory}-docs/LICENSE`, `${data}`, function(err){
      if(err){
          console.log(err)
      }
  });
}

module.exports = {
    generateMarkdown,
    renderLicenseBadge,
    fetchLicense,
};
