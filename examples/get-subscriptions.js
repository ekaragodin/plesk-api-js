const config = {
    url: {
        protocol: 'https',
        host: 'localhost',
        port: 8443,
    },
    credentials: {
        login: 'admin',
        password: 'changeme',
    },
    agentOptions: {
        rejectUnauthorized: false,
    },
};

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
