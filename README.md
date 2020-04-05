# offshop

[![Build Status](https://travis-ci.org/PHPiotr/offshop.svg?branch=master)](https://travis-ci.org/PHPiotr/offshop)
[![Coverage Status](https://coveralls.io/repos/github/PHPiotr/offshop/badge.svg?branch=master)](https://coveralls.io/github/PHPiotr/offshop?branch=master)
[![dependencies Status](https://david-dm.org/phpiotr/offshop/status.svg)](https://david-dm.org/phpiotr/offshop)
[![devDependencies Status](https://david-dm.org/phpiotr/offshop/dev-status.svg)](https://david-dm.org/phpiotr/offshop?type=dev)
[![Demo on Heroku](https://img.shields.io/badge/demo-heroku-brightgreen.svg?style=flat-rounded)](https://offshop-front-end.herokuapp.com)

## Example of required environment variables to be set up in `.env`:

```$javascript
REACT_APP_API_HOST=https://offshop-back-end.herokuapp.com
REACT_APP_AUTH0_AUDIENCE=https://offshop-back-end.herokuapp.com
REACT_APP_AUTH0_CLIENT_ID=**************************
REACT_APP_AUTH0_CLIENT_SECRET=**************************
REACT_APP_AUTH0_DOMAIN=johndoe.eu.auth0.com
REACT_APP_BUYER_LANGUAGE=pl
REACT_APP_CURRENCY_CODE=PLN
REACT_APP_FOOTER_TEXT="Your footer text"
REACT_APP_GOOGLE_PAY_API_VERSION=2
REACT_APP_GOOGLE_PAY_API_VERSION_MINOR=0
REACT_APP_GOOGLE_PAY_ENV=TEST
REACT_APP_LOGO_FONT=Roboto
REACT_APP_MAIN_COLOR=#3f51b5
REACT_APP_MERCHANT_NAME=Acme
REACT_APP_MERCHANT_POS_ID=**************************
REACT_APP_PAYU_CLIENT_ID=**************************
REACT_APP_PAYU_CLIENT_SECRET=**************************
REACT_APP_PAYU_URL=https://secure.snd.payu.com
REACT_APP_PRODUCT_PATH=https://your-bucket.s3.eu-central-1.amazonaws.com
REACT_APP_SECOND_KEY=**************************
REACT_APP_URL=https://offshop-front-end.herokuapp.com
```

## Available Scripts

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run dev:hot`

Runs the app in the development mode with hot-reloading enabled<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will not reload if you make edits.

### `npm test`

Launches the test runner in the interactive watch mode.<br>

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!
