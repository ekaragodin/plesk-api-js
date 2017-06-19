
jest.mock('request');

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
