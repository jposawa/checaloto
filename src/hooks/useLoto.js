import React from "react";
import { API_BASE_URL } from "../shared/constants";
import axios from "axios";
import { dateCompare, getDate, loadStorage, saveStorage, simplifyOrder } from "../shared/utils";
import { useSetRecoilState } from "recoil";
import { somaDezenasState } from "../shared/state";

const FALLBACK_LOTO = "megasena";

export const useLoto = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [fetchResult, setFetchResult] = React.useState();
  const defineSomaDezenas = useSetRecoilState(somaDezenasState);
  const checkNumbers = React.useCallback((allResults) => {
    const numberInfo = {
      modalidade: allResults[0].loteria,
      numbers: {},
      totalResults: allResults.length,
    };
    const sumsInfo = {};

    allResults.forEach((result) => {
      const soma = result.dezenas.reduce((accumulator, current) => Number(accumulator) + Number(current), 0);

      if (!sumsInfo[soma]) {
        sumsInfo[soma] = [];
      }

      sumsInfo[soma].push({
        dezenas: result.dezenas,
        data: result.data,
      });

      result.dezenas.forEach((number) => {
        if (!numberInfo.numbers[number]) {
          numberInfo.numbers[number] = {
            number,
            drawnIn: []
          }
        }

        numberInfo.numbers[number].drawnIn.push(result.concurso);
        const rawTotal = numberInfo.numbers[number].drawnIn.length;

        numberInfo.numbers[number].score = {
          raw: rawTotal,
          percent: ((rawTotal / numberInfo.totalResults) * 100).toFixed(2),
        };
      });
    });

    numberInfo.sorted = Object.values(numberInfo.numbers).sort((numberA, numberB) => (simplifyOrder(numberB.score.raw, numberA.score.raw)));

    // console.table({
    //   numberInfo,
    //   sumsInfo,
    //   personal: checkPersonalGames(allResults, numberInfo.modalidade),
    // })
    defineSomaDezenas(sumsInfo);
    saveStorage(`score-${numberInfo.modalidade}`, numberInfo, true, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLotoResult = React.useCallback((lotoName, options = {}) => {
    const {
      gameNumber,
      showAll = false,
      persist = true,
    } = options;
    setIsLoading(true);

    const targetLoto = lotoName || FALLBACK_LOTO;
    const targetGameNumber = isNaN(parseInt(gameNumber)) ? "latest" : parseInt(gameNumber);
    const finalUrl = `${API_BASE_URL}/${targetLoto}/${showAll ? "" : targetGameNumber}`;

    axios.get(finalUrl).then((response) => {
      const { data: lotoData } = response;

      if (!showAll) {
        lotoData.data = getDate(lotoData.data);
        lotoData.dataProximoConcurso = getDate(lotoData.dataProximoConcurso);
      }

      if (persist && !showAll) {
        saveStorage(lotoName, lotoData, true, true);
      }

      if (showAll) {
        checkNumbers(lotoData);
      }
      setFetchResult(lotoData);
    }).catch((error) => {
      console.warn("fetch error", error);
    }).finally(() => {
      setIsLoading(false);
    })
  }, [checkNumbers]);

  const getLotoResult = React.useCallback((lotoName, options = {}) => {
    const {
      forceFetch = false,
    } = options;
    setIsLoading(true);

    const localLotoData = loadStorage(lotoName, true, true);
    const currentDate = new Date();

    if (localLotoData) {
      localLotoData.dataProximoConcurso = new Date(localLotoData.dataProximoConcurso);
    }

    if (forceFetch || !localLotoData || dateCompare(currentDate, localLotoData.dataProximoConcurso) === 1) {
      fetchLotoResult(lotoName, options);
    } else {
      setFetchResult(localLotoData);
      setIsLoading(false);
    }
  }, [fetchLotoResult]);

  return {
    isLoading,
    data: fetchResult,
    getLotoResult,
    checkNumbers,
  };
}