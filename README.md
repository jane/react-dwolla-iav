# react-dwolla-iav

--------

## Installation and Usage

`npm i react-dwolla-iav`

Dwolla doesn't provide a library for their `Dwolla.js` client-side scripts. This
component wraps their script and provides a React component for embedding their
IAV flow.

* [IAV demo](https://iavdemo.dwolla.com/)
* [`dwollaConfig` docs](https://developers.dwolla.com/resources/dwolla-js/instant-account-verification.html#dwolla-iav-start)

```javascript
import * as React from 'react'
import Dwolla from 'react-dwolla-iav'

const onSuccess = (data) => { /* do stuff with data */ }
const onError = (err) => { /* handle err */ }

const dwollaConfig = {
  backButton: false,
  customerToken: 'asdf',
  environment: 'sandboox',
  fallbackToMicroDeposits: false,
  microDeposits: false,
  stylesheets: [],
  subscriber: () => {}
}

export default () => (
  <div>
    <Dwolla
      onSuccess={onSuccess}
      onError={onError}
      dwollaConfig={dwollaConfig}
    />
  </div>
)
```

This library assumes your environment has Promises, so you might need a
polyfill for old browers.

## License

[MIT](./LICENSE.md)
