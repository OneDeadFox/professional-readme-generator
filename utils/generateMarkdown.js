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
        fs.rm(`./docs/${globalDirectory}-docs/LICENSE`, function(err){
            if(err){
                console.log(err)
            }
        });
        }
}

function renderLicenseBadge(license, link, description) {
    fs.appendFile(`./docs/${globalDirectory}-docs/README.md`, `[![License](https://img.shields.io/badge/License-${license}-blue.svg)](${link})\n${description}\n\n\n`, (err) => err ? console.error(err) : console.log(``));
}

function generateMarkdown(data) {
    fs.writeFile(`./docs/${globalDirectory}-docs/LICENSE`, `${data}`, (err) => err ? console.error(err) : console.log(``));
}

module.exports = {
    generateMarkdown,
    renderLicenseBadge,
    fetchLicense,
};
