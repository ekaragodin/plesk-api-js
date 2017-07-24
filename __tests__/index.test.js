jest.mock('request');

const config = {
    url: {
        host: 'localhost',
    },
    credentials: {
        login: 'admin',
        password: 'changeme',
    },
};

const getServerResponse = `
<?xml version="1.0" encoding="UTF-8"?>
<packet version="1.6.9.0">
    <server>
        <get>
            <result>
                <status>ok</status>
            </result>
        </get>
    </server>
</packet>
`;


function createRequestMock(body, response = {statusCode: 200}, error = null) {
    const request = jest.fn();

    request.mockImplementationOnce((args, cb) => cb(error, response, body));
    require('request').__setMock(request);

    return request;
}

test('convert object to xml', async () => {
    const request = createRequestMock(getServerResponse);
    const api = require('../index').api(config);

    return api('server.get', {
        stat: {},
    }).then(() => {
        const xml = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<packet>
  <server>
    <get>
      <stat/>
    </get>
  </server>
</packet>
`.trim();

        expect(request.mock.calls.length).toBe(1);
        const body = request.mock.calls[0][0].body;
        expect(body).toEqual(xml);
    });
});

test('convert xml to object', async () => {
    createRequestMock(getServerResponse);
    const api = require('../index').api(config);

    return api('server.get', {
        stat: {},
    }).then((response) => {
        expect(response).toMatchObject({
            status: 'ok',
        });
    });
});

test('url custom config', async () => {
    const request = createRequestMock(getServerResponse);
    const api = require('../index').api(
        Object.assign({}, config, {
            url: {
                protocol: 'http',
                host: 'localhost',
                port: 8445,
            }
        })
    );

    return api('server.get', {
        stat: {},
    }).then(() => {
        expect(request.mock.calls[0][0].url).toBe('http://localhost:8445/enterprise/control/agent.php');
    });
});

test('url default config', async () => {
    const request = createRequestMock(getServerResponse);
    const api = require('../index').api(config);

    return api('server.get', {
        stat: {},
    }).then(() => {
        expect(request.mock.calls[0][0].url).toBe('https://localhost:8443/enterprise/control/agent.php');
    });
});
