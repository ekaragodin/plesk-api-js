# Plesk API for JavaScript

Simple JavaScript client for Plesk XML-RPC API.

## Installing

```sh
$ npm install --save plesk-api-js
```

## Usage

```js
const request = require('plesk-api-js').api({
    url: {
        host: 'my-plesk-host.com',
    },
    credentials: {
        login: 'admin',
        password: 'changeme',
    },
});

request('webspace.get', {
    filter: {},
    dataset: {
        hosting: {},
    },
})
.then((result) => {
    console.log(result)
});
```

More examples can be found in the examples folder.
