import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { fetchApiKey, fetchGame } from './models/game_data';
import GameElement from './GameElement';
import GameDetail from './GameDetail';

function App() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
//fetch api key 
  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchApiKey();
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initialize();
  }, []);
  
//search games on writing letters
  useEffect(() => {
    const searchGames = async () => {
      if (search) {
        try {
          const data = await fetchGame(search);
          setGames(data);
        } catch (error) {
          console.error("Error fetching games:", error);
        }
      }
    };

    searchGames();
  }, [search]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <h1>Game List</h1>
            <input
              type="text"
              placeholder="Search for a game"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className='search_games'>
              {games.map((game) => (
                <GameElement key={game.id} game={game} />
              ))}
            </div>
          </div>
        } />
        <Route path="/game/:id" element={<GameDetail />} />
      </Routes>
    </Router>
  );
}

export default App;