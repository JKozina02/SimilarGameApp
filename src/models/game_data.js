import axios from 'axios';

const ClientId = 'dpahxromrx2zq2oazrhjay10echshs'; // Add Client ID
let apiKey = ''; // Initialize apiKey as an empty string

export const fetchApiKey = async () => {
  try {
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${ClientId}&client_secret=kuclhf21myxbh5j8myi5atxzs7l26r&grant_type=client_credentials`
    );
    apiKey = response.data.access_token;
    console.log('API Key:', apiKey);
  } catch (err) {
    console.error('Error fetching API key:', err);
  }
};

export const fetchGame = async (gameName) => {
  try {
    const response = await axios.post(
      '/v4/games',
      `search "${gameName}"; fields name, genres.name, cover.url; where category = 0;`,
      {
        headers: {
          'Client-ID': ClientId,
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'text/plain'
        }
      }
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error("Game not found");
  }
};

export const fetchGameDetails = async (gameId) => {
  try {
    const response = await axios.post(
      '/v4/games',
      `fields name, genres.name, cover.url, summary, tags; where id = ${gameId};`,
      {
        headers: {
          'Client-ID': ClientId,
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'text/plain'
        }
      }
    );
    return response.data[0];
  } catch (err) {
    console.error(err);
    throw new Error("Game details not found");
  }
};

export const fetchSimilarGames = async (tags) => {
  try {
    const response = await axios.post(
      '/v4/games',
      `fields name, genres.name, cover.url; where tags = (${tags.join(',')}) & category = 0;`,
      {
        headers: {
          'Client-ID': ClientId,
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'text/plain'
        }
      }
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error("Similar games not found");
  }
};