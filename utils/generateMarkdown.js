// TODO: Create a function that returns a license badge based on which license is passed in
// If there is no license, return an empty string
function renderLicenseBadge(license, link, description) {
    fs.fileappend('README.md', `[![License](https://img.shields.io/badge/License-${license}-blue.svg)](${link})\n\n, ${description}`, (err) => err ? console.error(err) : console.log(`license badge successfully added to README`));
}

// TODO: Create a function to generate markdown for README
function generateMarkdown(data) {
    
}

module.exports = {
    generateMarkdown,
    renderLicenseBadge,
};
