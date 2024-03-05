/* eslint-disable react/prop-types */
import React from "react";
import { GAME_TYPES } from "../../shared/constants";
import styles from "./GameOptions.module.css";

export const GameOptions = React.forwardRef(function GameOptions({
  className,
  style,
  onChange,
  disabled = false,
}, ref) {
  return (
    <select
      className={`${styles.gameSelect} ${className || ""}`}
      style={{ ...style }}
      onChange={onChange}
      disabled={disabled}
      ref={ref}
    >
      {Object.values(GAME_TYPES).map((game, index) => (
        <option key={`${game.id}-${index}`} value={game.id}>
          {game.name}
        </option>
      ))}
    </select>
  );
});