import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameDetails, fetchSimilarGames } from './models/game_data';
import GameElement from './GameElement';
import '.styles/App.css';
import '.styles/GameDetail.css';

function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [similarGames, setSimilarGames] = useState([]);
  const [loading, setLoading] = useState(true); // Dodaj stan loading

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const gameData = await fetchGameDetails(id);
        setGame(gameData);
        const similarGamesData = await fetchSimilarGames(id);
        setSimilarGames(similarGamesData);
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        setLoading(false); // Ustaw loading na false po zakończeniu pobierania
      }
    };

    fetchDetails();
  }, [id]);

  return (
    <div className='App'>
      {loading ? ( // Wyświetl wskaźnik ładowania, gdy loading jest true
        <div className="loader"></div>
      ) : (
        game && (
          <>
            <div className='game_info'>
              <h1>{game.name}</h1>
              {game.cover && <img className='photo' src={game.cover.url.replace('t_thumb', 't_cover_big')} alt={game.name} />}
              <p>{game.summary}</p>
            </div>
            <h2>Similar Games</h2>
            <div className='search_games'>
              {similarGames.map((similarGame) => (
                <GameElement key={similarGame.id} game={similarGame} clickable={false}/>
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
}

export default GameDetail;