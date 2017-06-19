const request = require('../index').api(require('./_config'));

request('server.get', {
    stat: {}
})
.then((result) => {
    console.log(result)
})
.catch((err) => {
    console.log(err)
});
