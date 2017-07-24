const request = require('request');
const {parseString, Builder} = require('xml2js');

function api(config = {agentOptions: {}}) {
    return function (method, args = {}) {
        return new Promise((resolve, reject) => {
            const builder = new Builder();
            const body = builder.buildObject(
                buildRequest(method, args)
            );

            request({
                method: 'POST',
                url: buildUrl(config.url),
                headers: buildHeaders(config),
                body,
                agentOptions: config.agentOptions,
            }, (error, response, body) => {
                if (!error && response.statusCode) {
                    resolve(parseResponse(method, body));
                } else {
                    reject(error || body);
                }
            });
        });
    }
}

function buildUrl({host, protocol = 'https', port = 8443}) {
    return `${protocol}://${host}:${port}/enterprise/control/agent.php`;
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

function buildRequest(method, args = {}) {
    const packet = method.split('.').reduceRight((nested, key) => {
        return {
            [key]: nested
        };
    }, args);

    return {
        packet,
    };
}

function parseResponse(method, response) {
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
                    resolve(mapFromApi(method, result));
                }
            });
    });
}

function mapFromApi(method, data) {
    return get(`packet.${method}.result`, data);
}

function get(path, object) {
    const keys = path.split('.');
    let index = 0;

    while (object[keys[index]]) {
        object = object[keys[index++]];
    }

    return object;
}

module.exports = {
    api,
};
