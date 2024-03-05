import React from "react";
import PropType from "prop-types";
import { GameNumber } from "../";

import styles from "./GameResult.module.css";

export const GameResult = ({
  result,
}) => {
  const resultInsight = React.useMemo(() => {
    const infoDezenas = {
      pares: 0,
      impares: 0,
      soma: 0,
    };

    result.dezenas.forEach((dezena) => {
      infoDezenas.soma += Number(dezena);

      if (dezena % 2 === 0) {
        infoDezenas.pares += 1;
      } else {
        infoDezenas.impares += 1;
      }
    })

    return infoDezenas;
  }, [result]);
  return (
    <div className={styles.resultContainer}>
      <h4>Concurso <u>{result.concurso}</u></h4>

      <div
        className={`${styles.numbersContainer} ${result.dezenas.length % 5 === 0 ? styles.alternateWidth : ""}`}
      >
        {result.dezenas.map((number) => (
          <GameNumber key={number}>
            {number}
          </GameNumber>
        ))}
      </div>

      <div className={styles.insights}>
        <p><b>Soma:</b> <span>{resultInsight.soma}</span></p>
      </div>
    </div>
  )
}

GameResult.propTypes = {
  result: PropType.shape({
    concurso: PropType.number.isRequired,
    dezenas: PropType.arrayOf(PropType.string).isRequired,
  })
}