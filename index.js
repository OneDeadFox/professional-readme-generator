//TODO: Have app ask which which sections of README should be included after title question
//TODO: Pull license information from generateMarkdown

// TODO: Include packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const licFn = require('./utils/generateMarkdown');

// TODO: Create an object of questions for user input
    //1. Have questions associated with conditional statements reflecting checkbox choices
const initialQuestions = {
    titleQuestion: 'What is the project title? ',
    checkbox: 'Which README sections will be included? ',
    choices: ['Description', 'Installation', 'Usage', 'Contribution', 'Testing', 'Questions'],
};

const inputQuestions = ['Provide a description of your project: ', 'Provide installation instructions: ', 'Provide usage details: ',  'Provide contribution guidlines: ', 'Provide testing details: ', 'Provide your Github username: ', 'Provide email for answering user questions: ']

function makeDirectory(title){
    fs.mk
}

// TODO: Create a function to write README file
function writeReadme(content, section, header){
    console.log('section = ' + section);
    section = section.charAt(0).toUpperCase() + section.slice(1);
    console.log('line 33 = ' + section);
    if(section != 'Title'){
        //adds appropriate sections and data
        fs.appendFile('README.md', `### ${header}\n`, function(err){
            if(err){
                console.log(err)
            }
        });
        fs.appendFile('README.md', `${content}\n\n\n`, (err) =>
        err ? console.error(err) : console.log(`${section} successfully added to README`));
    }else{
        //create README and give it a title
        fs.mkdirSync(`./${content}-docs`, (err) => err ? console.error(err) : console.log(''));
        fs.writeFile(`./.${content}-docs/README.md`, `# ${content}\n\n\n`, (err) => err ? console.error(err) : console.log(`${section} successfully added to README`));
    }
}
// TODO: Create a function to initialize app
// TODO: have app console.log instructions for data entry
function init() {
    console.log('Please answer the set of following prompts to generate a README file.');
    inquirer
        .prompt([
            {
                type: 'input',
                message: initialQuestions.titleQuestion,
                name: 'title'
            },
            {
                type: 'checkbox',
                message: initialQuestions.checkbox,
                choices: initialQuestions.choices,
                name: 'sections'
            }
        ])
        .then((res) => {
            //remove 'Questions' and add keywords to array for nextQuestion search
            //setTimeout is used to make nextQuestion() prompt appear after success or error message from writeReadme()

            if(res.sections.includes('Questions')){
                res.sections.pop();
                res.sections.push('username');
                res.sections.push('email');
                setTimeout(() => {writeReadme(res.title, 'title')}, 0);
                setTimeout(() => {licenseSelect(res.sections)}, 100);
            }else{
                setTimeout(() => {writeReadme(res.title, 'title')}, 0);
                setTimeout(() => {licenseSelect(res.sections)}, 100);
            }
        });

// Function to fetch licenses and prompt user to select one
function licenseSelect(element){
    const licenseUrl = 'https://api.github.com/licenses';
    const sections = element
    fetch(licenseUrl)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                console.log(data);
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

                            licFn.fetchLicense(licenseUrl + '/' + licenseObj.spdx_id);
                        } else {
                            licFn.fetchLicense(res.licenseSelection);
                        }

                        setTimeout(() => {nextQuestion(sections)}, 100);
                        
                    });
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
            console.log('testing array = ' + arr);
            console.log(arr[0]);
            inquirer
                .prompt([
                    {
                        type: 'input',
                        message: inputQuestions[nextIndex],
                        name: 'answer'
                    }
                    ])
                    .then((res) => {
                        //remove first entry and repeat this function if > 0
                        //setTimeout is used to make nextQuestion() prompt appear after success or error message from writeReadme()
                        // const name = arrValue
                        // //console.log('line 106 = ' + JSON.parse(res));
                        // console.log('line 106 = ' + JSON.stringify(res));
                        // console.log('line 107 = ' + res.name);
                        // console.log('line 108 = ' + res.arrValue);
                        // console.log('line 109 = ' + res.name);
                        // console.log('line 110 = ' + name);
                        setTimeout(() => {writeReadme(res.answer, arr[0], arr[0])}, 0);
                        setTimeout(() => {
                            arr.splice(0,1);
                            if(arr.length > 0){
                                nextQuestion(arr);
                            }else{
                                console.log('Documentation generation has been completed.');
                            }
                        }, 10);
                });
    }
}

// Function call to initialize app
init();
