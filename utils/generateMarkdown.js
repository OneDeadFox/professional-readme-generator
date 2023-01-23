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
        fs.rm(`./${globalDirectory}-docs/LICENSE`, function(err){
            if(err){
                console.log(err)
            }
        });
        }
}

function renderLicenseBadge(license, link, description) {
    fs.appendFile(`./${globalDirectory}-docs/README.md`, `[![License](https://img.shields.io/badge/License-${license}-blue.svg)](${link})\n${description}\n\n\n`, (err) => err ? console.error(err) : console.log(`license badge successfully added to README.`));
}

function generateMarkdown(data) {
    fs.writeFile(`./${globalDirectory}-docs/LICENSE`, `${data}`, (err) => err ? console.error(err) : console.log(`LINCENSE document successfully generated.`));
}

module.exports = {
    generateMarkdown,
    renderLicenseBadge,
    fetchLicense,
};
