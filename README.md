# 🚀 Welcome to Sharemania API REST #


**This API REST is part of the web developer training from OpenClassrooms**
**Project 7 :**

***------------------***
***------------------***

### Installation ###

**1st:** Clone the repository at this URL : 
```
https://github.com/CyrilTrichereau/CyrilTrichereau_7_09022021.git
```

**2nd:** Install dependencies : from within the project folder, run `npm install`.

```
npm install
```

**3rd:** Then, store the .env file to the root repository of the project or create it with settings this attributes :

```env
NODE_ENV=development
CRYPTO_JS_KEY= 
JWT_KEY=
DEV_DATA_BASE_NAME=
DEV_DATA_BASE_USER=
DEV_DATA_BASE_PASSWORD=
DEV_DATA_BASE_HOST=
DEV_DATA_BASE_DIALECT=mysql
```

**4th:** Verify that mySQL is installed on your computer and create a database with informations from .env file

**5th:** After creating the database and checking the information in the .env file, you can initiate the data models with sequelize-CLI using :
```
sequelize db:migrate
``` 

**6th:** Now you can :

*Run the API with nodemon:*
```
nodemon server
```

**7th:** If database is empty, when the server will start, it will inject a fake database. It will take few minutes (around five for my old computer).


***------------------***
### Development config ###

node v14.16.0
mySQL 8.0.26
npm 7.20.0

***------------------***
***------------------***

*Have a question ?*
Do not hesitate to contact me !
