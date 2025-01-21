import React from 'react';
import { useNavigate } from 'react-router-dom';

function GameElement({ game, clickable = true }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (clickable) {
      navigate(`/game/${game.id}`);
    }
  };

  return (
    <div onClick={handleClick} style={{ cursor: clickable ? 'pointer' : 'default' }}>
      <h2>{game.name}</h2>
      {game.cover && <img src={game.cover.url.replace('t_thumb', 't_cover_big')} alt={game.name} />}
    </div>
  );
}

export default GameElement;