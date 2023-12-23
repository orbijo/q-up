# Q-Up

An online queueing app in compliance with CS 3105 Application Development Final Project  
[Demo Recording of App](https://youtu.be/UjMRUO9ck20)

## Members
- Josh Arkane C. Orbiso
- Giovanni Ross P. Sucalit

## Setup

### You can clone this repo via
```
git clone https://github.com/orbijo/q-up.git
cd q-up
```

### Setup the server by creating the appropriate .env file and installing dependencies
Creating .env
```env
MONGO_URL = 'mongodb+srv://myDatabaseUser:D1fficultP%40ssw0rd@cluster0.example.mongodb.net/?retryWrites=true&w=majority'
JWT_SECRET = '<YourOwnJWTSecret>'
PORT=3001
```
Be sure to already have a mongodb cloud up and running
[MongoDB Connection String Documentation](https://www.mongodb.com/docs/manual/reference/connection-string/)

run npm install
```
cd server
npm install
```

### Setup the react client by installing dependencies
run npm install
```
cd client
npm install
```

## Run
Run both server and client through:
```
cd server
npm start
```
```
cd client
npm start
```
