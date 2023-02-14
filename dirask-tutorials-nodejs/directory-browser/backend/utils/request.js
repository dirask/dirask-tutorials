const getWildcard = exports.getWildcard = (request, index = 0) => {
	const params = request.params;
	return params[index] ?? '';
};

const tryGet = exports.tryGet = (app, path, handler) => {
	return app.get(path, async (request, response, next) => {
		try {
			await handler(request, response);
		} catch (error) {
			return next(error);
		}
	});
};

const tryPost = exports.tryPost = (app, path, handler) => {
	return app.post(path, async (request, response, next) => {
		try {
			await handler(request, response);
		} catch (error) {
			return next(error);
		}
	});
};