# Weekly - Task Manager API

<img src="./public/Logo.png" width="100%">

## Description

Weekly is a task manager API made with node.js, express.js and mongoose.

## Production Link

To acess the final API, use the link:

<a href="http://ec2-3-144-86-147.us-east-2.compute.amazonaws.com:3333">http://ec2-3-144-86-147.us-east-2.compute.amazonaws.com:3333</a>

The application was deployed using AWS EC2 and MongoDB Atlas

## Weekly App

This api has an app made with HTML, CSS and JS

You can access the repository and the website:

- Repository: <a href="https://github.com/IgorSprovieri/weekly-web">github.com/IgorSprovieri/weekly-web</a>
- Website: <a href="https://igorsprovieri.github.io/weekly-web">igorsprovieri.github.io/weekly-web</a>

## Features

- Users and login system
- Save, get, update and delete tasks
- Save and get colors to use for tasks

## Documentation

Use insomnia to open the file below:

```
https://github.com/IgorSprovieri/Weekly/blob/main/insomnia.json
```

### Requirements

- Node.js (<a href="https://nodejs.org/en/">nodejs.org/en/</a>)
- Docker (<a href="https://www.docker.com">www.docker.com</a>)
- Mailjet Account (<a href="https://app.mailjet.com/">app.mailjet.com</a>)

## Getting Started

1- Clone the repo:

```
git clone https://github.com/IgorSprovieri/Weekly
```

2- Create DB on docker:

```
docker run --name weekly -p 27017:27017 -d mongo
```

3- Open the mongoDB compass and add DB:

```
http://localhost:27017
```

4- Navigate to the repository:

```
cd Weekly
```

5- Install the dependencies:

```
npm install
```

6 - Create .env following example:

ENVIROMENT=dev

PROD_PORT=</br>
PROD_DB=</br>
TEST_PORT=</br>
TEST_DB=</br>

JWT_HASH=

MJ_API_KEY=</br>
MJ_SECRET_KEY=</br>
MY_EMAIL=</br>
MY_EMAIL_NAME=</br>

You can create a jwt hash on site: <a href="https://www.md5hashgenerator.com">md5hashgenerator</a>

The keys MJ_API_KEY, MJ_SECRET_KEY, MY_EMAIL, MY_EMAIL_NAME will be config bellow. It's to forgot/reset password email

7- Run the API:

```
npm run start
```

8- Run the API on dev mode:

```
npm run start:dev
```

## Config Forgot/Reset Password Email

To reset the password, the API send a email with a token. For this system work, you need to config some things:

1. Create a mailjet development account (Link above)

2. Go to Account Settings > REST API > API Key Management (Primary and Sub-account)

3. Get the API KEY and SECRET KEY

4. Put the API KEY and SECRET KEY on .env file

   MJ_API_KEY=[your-API-KEY]</br>
   MJ_SECRET_KEY=[your-SECRET-KEY]

5. Put your email and your name that will be used to send email on .env file

   MY_EMAIL=[your-email]</br>
   MY_EMAIL_NAME=[your-name]

## Routes

### --------------- public routes ---------------

[get]/public/dateFNS.js

### --------------- unauthenticated routes ---------------

[post]/user

- Body:
  - [string] name
  - [string] email (required)(email format)
  - [string] password (required)(format is 6 numbers)

[post]login

- Body:
  - [string] email (required)(email format)
  - [string] password (required)(format is 6 numbers)

[post]forgot-password

- Body:
  - [string] email (required)(email format)

[post]reset-password

- Body:
  - [string] token (required)
  - [string] email (required)(email format)
  - [string] password (required)(format is 6 numbers)

[get]/colors

[post]/color

- Body:
  - [string] hexColor (required)(hex color format)

[put]/color/:id

- Body:
  - [string] hexColor (hex color format)

[delete]/color/:id

### --------------- authenticated routes ---------------

[headers] (required in all authenticated routes)

- [auth] bearer token
- [string] email (email format)

[get]/user

[put]/user

- Body:
  - [string] name
  - [string] email (email format)
  - [string] password (format is 6 numbers)

[delete]/user

- Body:
  - [string] password (required)(format is 6 numbers)

[get]/task?initialDate=<yyyy/mm/dd>T00%3A00%3A00.000Z&finalDate=<yyyy/mm/dd>T23%3A59%3A59.000Z

[post]/task

- Body:
  - [string] task
  - [string] hexColor (default: "#000000")(hex color format)
  - [date] initialDate (required)
  - [date] finalDate (required)
  - [string] description
  - [bool] isChecked (default: false)

[put]/task/:id

- Body:
  - [string] task
  - [string] hexColor (hex color format)
  - [date] initialDate
  - [date] finalDate
  - [string] description
  - [bool] isChecked

[delete]task/:id

## Author

<img src="./public/MyImage.jpeg" width="22%">

### _Igor Sprovieri Pereira_

Programming student since 2013, started working with Unity C# in 2020, paticipated in 16 projects as a freelancer and his own game studio. At this time, he was a tutor on Crie Seus Jogos company, helping students and writing articles to company's website. In 2022 he decided to learn web development with HTML, CSS and JS. Actually he is a fullstack programmer using javascript/typescript, react.js, node.js, express.js, docker, mongoose(mongoDB), postgres, sequelize and AWS.
