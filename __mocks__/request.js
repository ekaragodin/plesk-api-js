let mockRequest;

function request(args, callback) {
    return mockRequest.apply(mockRequest, arguments);
}

request.__setMock = function (mock) {
    mockRequest = mock;
};

module.exports = request;
