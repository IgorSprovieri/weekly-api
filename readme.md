<img src="./public/Logo.png" width="100%">

# Weekly API

Weekly is a task manager API made with Node, Express and Mongoose

## Features

- Users and login system
- Create, read, update and delete tasks
- Create, read, update and delete categories to use in your tasks
- Get predefined colors to use in your categories

## Production Link

This api was deployed using Railway.app and MongoDB Atlas

- link: [api.weekly.ispapps.com](https://api.weekly.ispapps.com)

## Documentation

Use insomnia to open the file below:

```
https://github.com/IgorSprovieri/weekly-api/blob/main/insomnia.json
```

### Requirements

- Node.js (<a href="https://nodejs.org/en/">nodejs.org/en</a>)
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

</br>ENVIROMENT=dev
</br>CORS_URL=\*

</br>JWT_HASH=

</br>MJ_API_KEY=
</br>MJ_SECRET_KEY=
</br>MY_EMAIL=
</br>MY_EMAIL_NAME=Weekly

You can create a JWT_HASH on site: [md5hashgenerator](https://www.md5hashgenerator.com)

The keys MJ_API_KEY, MJ_SECRET_KEY, MY_EMAIL, MY_EMAIL_NAME will be config bellow

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

### `POST` /user

- name `string`
- email `string` `required` `email format`
- password `string` `required` `six numbers format`

### `POST` /login

- email `string` `required` `email format`
- password `string` `required` `six numbers format`

### `POST` /forgot-password

- email `string` `required` `email format`

### `POST` /reset-password

- token `required`
- email `string` `required` `email format`
- password `string` `required` `six numbers format`

### `GET` /colors

#### --------------- authenticated routes ---------------

### `headers`

```
-  bearer token (required in all authenticated routes)
```

### `GET` /user

### `PUT` /user

- name `string`
- email `string` `email format`
- password `string` `six numbers format`

### `DELETE` /user

- password `string` `six numbers format`

### `POST` /category

- name `string` `required`
- hexColor `string` `required` `hex color format`

### `GET` /categories

- name `string` `required`
- hexColor `string` `required` `hex color format`

### `PUT` /category/:id

- name `string`
- hexColor `string` `hex color format`

### `DELETE` /category/:id

### `POST` /task

- task `string`
- category `object` `required` `{ [string]name, [string]hexColor }`
- initialDate `date` `required`
- finalDate `date` `required`
- description `string`
- subTasks `array` `required` `{ task: string, checked: boolean }`
- isChecked `boolean`

### `GET` /tasks?initialDate=<yyyy/mm/dd>T00%3A00%3A00.000Z&finalDate=<yyyy/mm/dd>T23%3A59%3A59.000Z

### `PUT` /task/:id

- task `string`
- category `object` `{ [string]name, [string]hexColor }`
- initialDate `date`
- finalDate `date`
- description `string`
- subTasks `array` `{ task: string, checked: boolean }`
- isChecked `boolean`

### `DELETE` /task/:id

## Author

<img id='my-image' src="https://media.licdn.com/dms/image/D4D03AQFdLhogHwQVog/profile-displayphoto-shrink_800_800/0/1672976913935?e=1698883200&v=beta&t=ZAnMJaP-tyQYjdVQWRZbWGKN3jf-zKqIV4J2sH1pTPU" width="22%">

### _Igor Sprovieri Pereira_

After work 3 years with Unity Developer, I migrated to the web full stack development and actually I have fullstack knowledge. I also have a library, inspired in React, named Frag Components.
