# react-dwolla-iav

--------

## Installation and Usage

`npm i react-dwolla-iav`

Dwolla doesn't provide a library for their `Dwolla.js` client-side scripts. This
component wraps their script and provides a React component for embedding their
IAV flow.

```javascript
import * as React from 'react'
import Dwolla from 'react-dwolla-iav'

const onSuccess = (data) => { /* do stuff with data */ }
const onError = (err) => { /* handle err */ }

export default () => (
  <div>
    <Dwolla
      onSuccess={onSuccess}
      onError={onError}
      customerToken="some string"
    />
  </div>
)
```

## License

[MIT](./LICENSE.md)
