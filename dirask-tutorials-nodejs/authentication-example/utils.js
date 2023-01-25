const logError = (error) => {
    console.error(error);
};

const sendSuccess = (response, message) => {
    response.json({
        success: true,
        message
    });
};

const sendError = (response, message) => {
    response.json({
        success: false,
        message
    });
};

module.exports = {
    logError,
    sendSuccess,
    sendError
};