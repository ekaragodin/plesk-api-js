const request = require('../index').api(require('./_config'));

request('webspace.get', {
    filter: {},
    dataset: {
        hosting: {},
    },
})
.then((result) => {
    console.log(result)
})
.catch((err) => {
    console.log(err)
});
