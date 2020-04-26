

// dependencies
const fs = require('fs'),
  convertFactory = require('electron-html-to');
const axios = require("axios");
const inquirer = require("inquirer");
const generateHTML = require("./generateHTML");
const conversion = convertFactory({
  converterPath: convertFactory.converters.PDF
});

// inquirer questions
function init() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter your GitHub username:",
        name: "username"
      },
      {
        type: "list",
        mesage: "Select your preferred color",
        choices: ["green", "blue", "pink", "red"],
        name: "color"
      }])
      
    

    // api call to github API - referenced in class activity 33
    .then(function ({ username, color }) {
      const queryURL = `https://api.github.com/users/${username}`;
      axios.get(queryURL).then(function (response) {

        let photo = response.data.avatar_url;
        let name = response.data.login;
        let location = response.data.location;
        let company = response.data.company;
        let profile = response.data.html_url;
        let blog = response.data.blog;
        let bio = response.data.bio;
        let repos = response.data.public_repos;
        let followers = response.data.followers;
        let following = response.data.following;

        console.log(photo, name, location, profile, blog, bio, repos, followers, following);


        const html = generateHTML({color, photo, name, location, company, profile, blog, bio, repos, followers, following });

        conversion({ html: html}, function (err, result) {
          if (err) {
            return console.error(err);
          }
          console.log(result.numberOfPages);
          console.log(result.logs);
          result.stream.pipe(fs.createWriteStream('./index.pdf'));
          conversion.kill(); 
        });




      })
    })
}
// call function
init();


