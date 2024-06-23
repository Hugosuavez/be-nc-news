# Northcoders News API

### https://be-nc-news-unk8.onrender.com/api

### Introduction
 NC News is an api for accessing a news database of articles, comments, topics and users. Clients can access this data via a variety of endpoints. Valid users can post new articles and comments. Full documentation is provided in the endpoints.json file.

 ### Installation Guide
 Clone this repository: https://github.com/Hugosuavez/be-nc-news

Run npm install to install dependencies.

Install devDependencies: jest, jest-extended, jest-sorted, supertest. 

Add the following as a property in your package.json object to ensure jest will function.

"jest": {
    "setupFilesAfterEnv": [
      "jest-extended/all", "jest-sorted"
    ]
  }

Take a look at the seed function to gain an understanding of the structure of the database you are working with.

In order to access databases in this repo, create two .env.* files, test and development, in the root folder of your project. Set the environment variable PGDATABASE to the appropriate database for that file. Refer to setup.sql for database names. Add these file names to the .gitignore file to maintain security.

### Usage
Run two set-up scripts:
npm run setup-dbs - this will create your databases.
npm run seed - this will create and seed your tables.

To test your work run the command:
npm test <filename>


### Minimum requirements
Node v21.5.0
Postgres 15.7

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
