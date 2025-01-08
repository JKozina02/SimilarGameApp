import React from 'react';
import { useNavigate } from 'react-router-dom';

function GameElement({ game }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game/${game.id}`);
  };

  return (
    <div onClick={handleClick}>
      <h2>{game.name}</h2>
      {game.cover && <img src={game.cover.url.replace('t_thumb', 't_cover_big')} alt={game.name} />}
    </div>
  );
}

export default GameElement;