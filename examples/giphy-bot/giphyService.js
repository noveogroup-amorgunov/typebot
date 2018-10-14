const axios = require('axios');

const API_KEY = process.env.GIPHY_API_KEY;

function getApiEndpoind(q) {
    return `http://api.giphy.com/v1/gifs/search?q=${q}&api_key=${API_KEY}&limit=1`;
}

async function getGifUrlByKeywords(keywords) {
    const response = await axios.get(getApiEndpoind(keywords));

    return response.data.data[0].images.fixed_height.url;
}

module.exports = { getGifUrlByKeywords };
