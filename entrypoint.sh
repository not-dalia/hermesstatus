#!/bin/sh

npm install
npx sequelize db:migrate
npm start -s
