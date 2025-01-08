import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameDetails, fetchSimilarGames } from './models/game_data';
import GameElement from './GameElement';

function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [similarGames, setSimilarGames] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const gameData = await fetchGameDetails(id);
        setGame(gameData);
        if (gameData.tags) {
          const similarGamesData = await fetchSimilarGames(gameData.tags);
          setSimilarGames(similarGamesData);
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    fetchDetails();
  }, [id]);

  return (
    <div>
      {game && (
        <>
          <h1>{game.name}</h1>
          {game.cover && <img src={game.cover.url.replace('t_thumb', 't_cover_big')} alt={game.name} />}
          <p>{game.summary}</p>
          <h2>Similar Games</h2>
          <div className='search_games'>
            {similarGames.map((similarGame) => (
              <GameElement key={similarGame.id} game={similarGame} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default GameDetail;