const config = require('./_config');

const request = require('../index').api(config);
request({
    webspace: {
        get: {
            filter: {},
            dataset: {
                hosting: {},
            }
        }
    }
})
.then((response) => {
    console.log(response.webspace.get)
})
.catch((err) => {
    console.log(err)
});
