const request = require('request');
const {parseString, Builder} = require('xml2js');

function api(config = {agentOptions: {}}) {
    // todo: check required attributes

    return function (args = {}) {
        return new Promise((resolve, reject) => {
            const builder = new Builder();

            args = {
                packet: args,
            };

            request({
                method: 'POST',
                url: buildUrl(config.url),
                headers: buildHeaders(config),
                body: builder.buildObject(args),
                agentOptions: config.agentOptions,
            }, (error, response, body) => {
                if (!error && response.statusCode) {
                    resolve(parseResponse(body));
                } else {
                    reject(error || body);
                }
            });
        });
    }
}

function buildUrl(config) {
    return `${config.protocol}://${config.host}:${config.port}/enterprise/control/agent.php`;
}

function buildHeaders(config) {
    if (config.credentials.secretKey) {
        return {
            'KEY': config.credentials.secretKey,
        };
    }

    return {
        'HTTP_AUTH_LOGIN': config.credentials.login,
        'HTTP_AUTH_PASSWD': config.credentials.password,
    };
}

function parseResponse(response) {
    return new Promise((resolve, reject) =>{
        parseString(
            response,
            {
                explicitArray: false,
                emptyTag: null,
            },
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(mapFromApi(result));
                }
            });
    });
}

function mapFromApi(data) {
    delete data.packet.$;

    return data.packet;
}

module.exports = {
    api,
};
