import axios from 'axios';

const ClientId = 'dpahxromrx2zq2oazrhjay10echshs'; // Add Client ID
let apiKey = ''; // Initialize apiKey as an empty string

export const fetchApiKey = async () => {
  try {
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${ClientId}&client_secret=kuclhf21myxbh5j8myi5atxzs7l26r&grant_type=client_credentials`
    );
    apiKey = response.data.access_token;
  } catch (err) {
    console.error('Error fetching API key:', err);
  }
};

export const fetchGame = async (gameName) => {
  try {
    const response = await axios.post(
      '/v4/games',
      `search "${gameName}"; fields name, genres.name, cover.url; where category = 0; limit 500;`,
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
export const fetchAllGames = async (genres) => {
  const limit = 500;
  let offset = 0;
  let allGames = [];
  let hasMore = true;
  while (hasMore) {
    try {
      const response = await axios.post(
        '/v4/games',
        `fields name, genres.name, cover.url, summary, keywords, themes, player_perspectives; where category = 0 & first_release_date > 946684800 & genres = (${genres.join(',')}); limit ${limit}; offset ${offset};`,
        {
          headers: {
            'Client-ID': ClientId,
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'text/plain'
          }
        }
      );
      const games = response.data;
      allGames = allGames.concat(games);
      if (games.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    } catch (err) {
      console.error(err);
      throw new Error("Games not found");
    }
  }

  console.log(allGames);
  return allGames;
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

export const fetchSimilarGames = async (gameId) => {
  try {
    const game = await fetchGameDetails(gameId);
    const genres = game.genres.map(g => g.id);
    const allGames = await fetchAllGames(genres);


    const calculateSimilarity = (game1, game2) => {
      let score = 0;

    // Compare genres
    if (game1.genres && game2.genres) {
      const genres1 = new Set(game1.genres.map(g => g.id));
      const genres2 = new Set(game2.genres.map(g => g.id));
      const commonGenres = [...genres1].filter(g => genres2.has(g));
      score += commonGenres.length * 5;
    }

    // Compare player perspectives
    if (game1.player_perspectives && game2.player_perspectives) {
      const perspectives1 = new Set(game1.player_perspectives.map(p => p.id));
      const perspectives2 = new Set(game2.player_perspectives.map(p => p.id));
      const commonPerspectives = [...perspectives1].filter(p => perspectives2.has(p));
      if (commonPerspectives.length > 0) {
        score += 5;
      }
    }

    // Compare keywords
    if (game1.keywords && game2.keywords) {
      const keywords1 = new Set(game1.keywords.map(k => k.id));
      const keywords2 = new Set(game2.keywords.map(k => k.id));
      const commonKeywords = [...keywords1].filter(k => keywords2.has(k));
      score += commonKeywords.length * 5;
    }

    // Compare themes
    if (game1.themes && game2.themes) {
      const themes1 = new Set(game1.themes.map(t => t.id));
      const themes2 = new Set(game2.themes.map(t => t.id));
      const commonThemes = [...themes1].filter(t => themes2.has(t));
      score += commonThemes.length * 5;
    }
      return score;
    };

    const similarGames = allGames
      .map(g => ({ ...g, similarity: calculateSimilarity(game, g) }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10); // Get top 10 similar games

    return similarGames;
  } catch (err) {
    console.error(err);
    throw new Error("Similar games not found");
  }
};