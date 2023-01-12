# Weekly

Weekly is a task manager API made with mongoose and express.js

## Production App

To acess the final API, use the link:

<a href="https://weekly.herokuapp.com">weekly.herokuapp.com</a>

The application was deployed using Heroku and MongoDB Atlas

## Features

- Users and login system
- Save, get, update and delete tasks
- Save and get colors to use for tasks

## Used technologies

- Node.js
- Express.js
- Mongoose
- Docker
- Nodemon
- JsonWebToken
- Insomnia

### Required

- Node.js (<a href="https://nodejs.org/en/">nodejs.org/en/</a>)
- Docker (<a href="https://www.docker.com">www.docker.com</a>)
- MongoDB Compass (<a href="https://www.mongodb.com/products/compass">www.mongodb.com/products/compass</a>)
- Mailjet account (<a href="https://app.mailjet.com/">app.mailjet.com</a>)

### Dependencies (npm)

- Express.js
- Mongoose
- Nodemon
- JsonWebToken
- Cors
- Dotenv
- Random-token
- Bcrypt
- Node-mailjet
- Date-fns

### To test

- Insomnia (<a href="https://insomnia.rest/download">insomnia.rest/download</a>)

### To deploy

- MongoDB Atlas (<a href="https://www.mongodb.com">www.mongodb.com</a>)
- Heroku (<a href="https://id.heroku.com">id.heroku.com</a>)

## Getting Started

1- Clone the repository:

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

PORT=3333</br>
DATABASE_URL=mongodb://localhost:27017</br>
JWT_HASH=[my-secret-hash-here]</br>
MJ_API_KEY=</br>
MJ_SECRET_KEY=</br>
MY_EMAIL=</br>
MY_EMAIL_NAME=

You can create a secret hash on site: <a href="https://www.md5hashgenerator.com">md5hashgenerator</a>

The keys MJ_API_KEY, MJ_SECRET_KEY, MY_EMAIL, MY_EMAIL_NAME will be config bellow. It is to forgot/reset password email

7- Run the API:

```
npm run start
```

8- Run the API on dev mode:

```
npm run start:dev
```

# Config Forgot/Reset Password Email

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

## To test

### Dependencies

- Insomnia (link above)

### Steps

1. Open insomnia and import the json

```
\insomnia.json
```

2. Edit the Base_url to local host

(Required create database following the Getting Started)

General > Manage Enviroments

```
{
	"BaseURL": "http://localhost:3333"
}
```

3. You can test with production url too

```
{
	"BaseURL": "https://weekly.herokuapp.com"
}
```

4. Test the routes following rules bellow

## Routes

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
- [string] email

[get]/user

[put]/user

- Body:
  - [string] name
  - [string] email (email format)
  - [string] password (format is 6 numbers)

[delete]/user

- Body:
  - [string] password (required)(format is 6 numbers)

[get]/task

- Body:
  - [date] initialDate (required)
  - [date] finalDate (required)

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

Igor Sprovieri Pereira

Programming student since 2013, started working with Unity C# in 2020, paticipated in 16 team projects as a freelancer and his own game studio. At this time, he was a tutor on Crie Seus Jogos company, helping students and writing articles to company's website. In 2022 he decided to learn web development with HTML, CSS and JS. Actually he is back-end programmer and he is specializing in node.js, mongoose, postgres and sequelize.
