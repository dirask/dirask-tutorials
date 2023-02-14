// Source: https://dirask.com/snippets/js-send-POST-JSON-fetch-request-p5m4xp
//
export const sendData = async (requestUrl, requestData) => {
    const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)  // request payload
    });
    return await response.json();
};

export const fetchData = async (requestUrl) => {
    const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    return await response.json();
};