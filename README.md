# offshop

[![Build Status](https://travis-ci.org/PHPiotr/offshop.svg?branch=master)](https://travis-ci.org/PHPiotr/offshop)
[![Coverage Status](https://coveralls.io/repos/github/PHPiotr/offshop/badge.svg?branch=master)](https://coveralls.io/github/PHPiotr/offshop?branch=master)
[![dependencies Status](https://david-dm.org/phpiotr/offshop/status.svg)](https://david-dm.org/phpiotr/offshop)
[![devDependencies Status](https://david-dm.org/phpiotr/offshop/dev-status.svg)](https://david-dm.org/phpiotr/offshop?type=dev)
[![Demo on Heroku](https://img.shields.io/badge/demo-heroku-brightgreen.svg?style=flat-rounded)](https://offshop-front-end.herokuapp.com)

## Example of required environment variables to be set up in `.env`:

```$javascript
REACT_APP_PAGE_TITLE=Offshop
REACT_APP_LOGO_FONT=Pacifico
REACT_APP_MAIN_COLOR=#3e2723
REACT_APP_AWS_ACCESS_KEY_ID=**************************
REACT_APP_AWS_SECRET_ACCESS_KEY=**************************
REACT_APP_AWS_S3_BUCKET=foo-1
REACT_APP_AWS_S3_REGION=eu-central-1
REACT_APP_PRODUCT_PATH=http://foo-1.s3.eu-central-1.amazonaws.com
REACT_APP_PAYU_CONTINUE_URL=http://localhost:3001/order
REACT_APP_API_HOST=http://localhost:9004
REACT_APP_API_HOST=https://path/to/backend//api/repo/offshop-back-end
REACT_APP_AUTH0_DOMAIN=your.domain.auth0.com
REACT_APP_AUTH0_CLIENT_ID=**************************
REACT_APP_AUTH0_CLIENT_SECRET=**************************
REACT_APP_AUTH0_REDIRECT_URI=http://localhost:3001/callback
REACT_APP_AUTH0_RESPONSE_TYPE=token id_token
REACT_APP_AUTH0_SCOPE=openid
REACT_APP_AUTH0_AUDIENCE=https://path/to/backend//api/repo/offshop-back-end
PORT=3001
SERVER_ALIVE_INTERVAL=600
DOMAIN_NAME=offshop-front-end
HTTPS=false
GENERATE_SOURCEMAP=true
REACT_APP_GOOGLE_PAY_ENV=TEST
REACT_APP_GOOGLE_PAY_SCRIPT_ID=google-pay-script
REACT_APP_GOOGLE_PAY_SCRIPT_SRC=https://pay.google.com/gp/p/js/pay.js
REACT_APP_GOOGLE_PAY_API_VERSION=2
REACT_APP_GOOGLE_PAY_API_VERSION_MINOR=0
REACT_APP_GOOGLE_PAY_TOKENIZATION_TYPE=PAYMENT_GATEWAY
REACT_APP_GOOGLE_PAY_TOKENIZATION_GATEWAY=payu
REACT_APP_GOOGLE_PAY_ALLOWED_CARD_NETWORKS=MASTERCARD,VISA
REACT_APP_GOOGLE_PAY_ALLOWED_CARD_AUTH_METHODS=PAN_ONLY,CRYPTOGRAM_3DS
REACT_APP_GOOGLE_PAY_BASE_CARD_PAYMENT_METHOD_TYPE=CARD
REACT_APP_MERCHANT_POS_ID=**************************
REACT_APP_SECOND_KEY=**************************
REACT_APP_SECOND_KEY_OAUTH_PROTOCOL_CLIENT_ID=**************************
REACT_APP_SECOND_KEY_OAUTH_PROTOCOL_CLIENT_SECRET=**************************
REACT_APP_MERCHANT_NAME=Offshop
REACT_APP_TOTAL_PRICE_STATUS=FINAL
REACT_APP_CURRENCY_CODE=PLN
REACT_APP_PAYU_CLIENT_ID=**************************
REACT_APP_PAYU_CLIENT_SECRET=**************************
REACT_APP_PAYU_METHOD_VALUE_GOOGLE_PAY=ap
REACT_APP_PAYU_METHOD_TYPE_GOOGLE_PAY=PBL
REACT_APP_PAYU_NOTIFY_PATH=/orders/notify
REACT_APP_PAYU_BASE_URL=https://secure.snd.payu.com
REACT_APP_PAYU_API_URL=https://secure.snd.payu.com/api/v2_1
REACT_APP_BUYER_LANGUAGE=pl
REACT_APP_MCP_PARTNER_ID=**************************
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
