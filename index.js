//TODO: Have app ask which which sections of README should be included after title question
//TODO: Pull license information from generateMarkdown

// TODO: Include packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const licFn = require('./utils/generateMarkdown');
var globalDirectory;

// TODO: Create an object of questions for user input
    //1. Have questions associated with conditional statements reflecting checkbox choices
const initialQuestions = {
    titleQuestion: 'What is the project title? ',
    checkbox: 'Which README sections will be included? ',
    choices: ['Description', 'Installation', 'Usage', 'Contribution', 'Testing', 'Questions'],
};

const inputQuestions = ['Provide a description of your project: ', 'Provide installation instructions: ', 'Provide usage details: ',  'Provide contribution guidlines: ', 'Provide testing details: ', 'Provide your Github username: ', 'Provide email for answering user questions: ']

function makeDirectory(){
    fs.mkdirSync(`./docs/${globalDirectory}-docs`, function(err){
        if(err){
            console.log(err)
        }
    });
}

function makeToc(sections){
    let sectionsList = ``;
    for (const section of sections) {
        sectionsList += `   * [${section}](#${section})\n`
    }
    fs.appendFile(`./docs/${globalDirectory}-docs/README.md`, 
    `## Table of Contents\n${sectionsList}\n\n`, function(err){
        if(err){
            console.log(err)
        }
    });
}

// TODO: Create a function to write README file
function writeReadme(content, section, header){

    section = section.charAt(0).toUpperCase() + section.slice(1);

    if(section != 'Title'){
        //adds appropriate sections and data
        fs.appendFile(`./docs/${globalDirectory}-docs/README.md`, `## ${header}\n\n`, function(err){
            if(err){
                console.log(err)
            }
        });
        setTimeout(() => {
            fs.appendFile(`./docs/${globalDirectory}-docs/README.md`, `${content}\n\n\n\n`, function(err){
                if(err){
                    console.log(err)
                }
            });
        }, 100);
    }else{
        //create README and give it a title

        fs.writeFile(`./docs/${globalDirectory}-docs/README.md`, `# ${content}\n\n\n\n`, function(err){
            if(err){
                console.log(err)
            }
        });
    }
}
// Initalization----------------------------------------------------------
function init() {
    console.log('Please answer the set of following prompts to generate a README file.');

    inquirer
        .prompt([
            {
                type: 'input',
                message: initialQuestions.titleQuestion,
                name: 'title'
            },
            //
        ])
        .then((res) => {
            
            globalDirectory = res.title.replace(/\s/g, "-").toLowerCase();
            makeDirectory()
            writeReadme(res.title, 'title');
            licenseSelect();
        });

// Function to fetch licenses and prompt user to select one
function licenseSelect(){
    const licenseUrl = 'https://api.github.com/licenses';
    fetch(licenseUrl)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                let licesnseData = [];
                let licenses = [];
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    licenses.push(element.name);
                    licesnseData.push(element);
                }
                licenses.unshift('None');
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            message: 'Please select a license from the following list:',
                            choices: licenses,
                            pageSize: 11,
                            loop: false,
                            name: 'licenseSelection'
                        }
                    ])
                    .then((res) => {
                        //this is kind of silly because I could complete the following steps in this then statement but i'm going to send it to utils anyways.
                        if(res.licenseSelection != 'None'){
                            const licenseObj = licesnseData.find(obj => obj.name === res.licenseSelection);

                            licFn.fetchLicense(licenseUrl + '/' + licenseObj.spdx_id, globalDirectory);
                        } else {
                            licFn.fetchLicense(res.licenseSelection, globalDirectory);
                        }
                        
                        sectionSelect();
                        
                        
                        
                    });
            });
}

function sectionSelect(){
    
    inquirer
        .prompt([
            {
                type: 'checkbox',
                message: initialQuestions.checkbox,
                choices: initialQuestions.choices,
                name: 'sections'
            }
        ])
        .then((res) => {
            if(res.sections[0] === undefined){
                console.log('Please select at least 1 section to include in README.')
                sectionSelect();
            }else if(res.sections.includes('Questions')){
                makeToc(res.sections);
                setTimeout(() => {
                    nextQuestion(res.sections)}, 100);
            }else{
                makeToc(res.sections);
                setTimeout(() => {
                    nextQuestion(res.sections)}, 100);
            }
        });

    
}

    function nextQuestion(arr){
            //find arr[0]'s value in inputQuestions to load next appropriate question into inquirer
            var arrValue = String(arr[0]).toLowerCase();
            var nextIndex;
            for (let i = 0; i < inputQuestions.length; i++) {
                const element = inputQuestions[i];
                if(element.includes(arrValue)){
                    nextIndex = i;
                }
            }

            if(arr[0] === 'Questions'){
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            message: inputQuestions[5],
                            name: 'username'
                        },
                        {
                            type: 'input',
                            message: inputQuestions[6],
                            name: 'email'
                        }
                        ])
                        .then((res) => {
                            fs.appendFile(`./docs/${globalDirectory}-docs/README.md`, `## Questions
                            
If you have any questions or comments regarding my application please contact me:\n\n\  Github: [${res.username}](https://github.com/${res.username})\n\n    Email: ${res.email}`,
                            function(err){
                                if(err){
                                    console.log(err)
                                }
                            });
                            console.log('Documentation generation has been completed.');
                    });
            }else{
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            message: inputQuestions[nextIndex],
                            name: 'answer'
                        }
                        ])
                        .then((res) => {
                            setTimeout(() => {writeReadme(res.answer, arr[0], arr[0])}, 0);
                            setTimeout(() => {
                                arr.splice(0,1);
                                if(arr.length > 0){
                                    nextQuestion(arr);
                                }else{
                                    console.log('Documentation generation has been completed.');
                                }
                            }, 100);
                    });
            }
    }
}

// Function call to initialize app
init();
