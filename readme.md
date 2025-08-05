<img src="./public/Logo.png" width="100%">

# Weekly API

Weekly it's a task manager API that include:

- Users and login system with JWT and Mailjet
- Create, read, update and delete tasks
- Create, read, update and delete categories to use in your tasks
- Get predefined colors to use in your categories

## Live Application

```
https://api.weekly.ispapps.com
```

This api was deploed with Railway

## Documentation

- 1. Use insomnia to open the file below:

```
https://github.com/IgorSprovieri/weekly-api/blob/main/insomnia.json
```

- 2. Read the docs: [Weekly API Docs](#routes)

```
Read the docs to use the API
```

## Used Tecnologies

- Express
- Mongoose

## Main Concepts Applied

- REST API
- HTTP ROUTES
- noSQL with mongoDB
- Json Web Token
- Middlewares
- Email Provider

## Requirements To Run

- Node.js (<a href="https://nodejs.org/en/">nodejs.org/en</a>)
- Docker (<a href="https://www.docker.com">www.docker.com</a>)

## Getting Started

1- Clone the repo:

```
git clone https://github.com/IgorSprovieri/weekly-api
```

2- Create DB on docker:

```
docker run --name weekly -p 27017:27017 -d mongo
```

3- Navigate to the repository:

```
cd weekly-api
```

4- Install the dependencies:

```
npm install
```

5 - Create .env following example:

</br>ENVIROMENT=dev
</br>CORS_URL=\*
</br>JWT_HASH=
</br>MJ_API_KEY=
</br>MJ_SECRET_KEY=
</br>MY_EMAIL=
</br>MY_EMAIL_NAME=Weekly

You can create a JWT_HASH on website: [md5hashgenerator](https://www.md5hashgenerator.com)

The keys MJ_API_KEY, MJ_SECRET_KEY, MY_EMAIL, MY_EMAIL_NAME will be config below

7- Run the API:

```
npm run start
```

8- Run the API on dev mode:

```
npm run start:dev
```

## Config Forgot/Reset Password Email (Optional)

### Requirement

- Mailjet Account (<a href="https://app.mailjet.com/">app.mailjet.com</a>)

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

### --------------- authenticated routes ---------------

---

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

<img src="./public/MyImage.jpeg" alt="Igor Sprovieri" style="width: 30%; border-radius: 32px;">

### _Igor Sprovieri Pereira_

Developer since 2020, I already worked in games area with Unity, fullstack development area with React, React Native and Node, and actually I am specializing in backend.
