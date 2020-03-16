# node-backend-template-1

"dependencies": {
  "body-parser": "^1.19.0",
  "express": "^4.17.1",
  "express-jwt": "^5.3.1",
  "jsonwebtoken": "^8.5.1",
  "method-override": "^2.3.10",
  "mongoose": "^5.8.11",
  "passport": "^0.4.0",
  "passport-jwt": "^4.0.0",
  "passport-local": "^1.0.0",
  "passport-local-mongoose": "^4.2.1",
  "request": "^2.81.0"
}

To run, follow these steps:
1) npm i
2) change mongo_connect_url in config.json
3) npm run start

You can find the application running at localhost:2001

Usage:
On register and login, user token will be sent as response, store that in front end and send it back in header with key name "token".

For user register|login|update, there are routes in routes/index.js

For reference there are sample models/routes(campgrounds and comments).


