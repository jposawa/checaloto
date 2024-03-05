/* eslint-disable react/prop-types */
import React from "react";
import styles from "./ResultSection.module.css";
import { GameResult } from "../GameResult";
import { simplifyOrder } from "../../shared/utils";

export const ResultSection = ({
  result,
  isLoading,
  crescente = false,
}) => {
  const resultList = React.useMemo(() => {
    if (!result) {
      return [];
    }

    if (!Array.isArray(result)) {
      return [result];
    }

    const sortedResult = crescente ? result.sort((itemA, itemB) => (
      simplifyOrder(itemA.concurso, itemB.concurso)
    )) : result;
    return sortedResult;
  }, [crescente, result]);

  return (
    <div className={styles.resultListContainer}>
      {!isLoading ? resultList.map((item) => {
        return (
          <GameResult key={item.concurso} result={item} />
        )
      }) : <></>}
    </div>
  )
}