const config = require('./_config');

const request = require('../index').api(config);
request({
    server: {
        get: {
            stat: {},
        }
    }
})
.then((response) => {
    console.log(response.server.get)
})
.catch((err) => {
    console.log(err)
});
