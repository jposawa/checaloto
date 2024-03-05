import { PREFIX } from "../constants";
import { personalGames, target } from "../constants/games";

export const cloneObj = (baseObj) => (
  JSON.parse(JSON.stringify(baseObj))
);

export const isEqual = (obj1, obj2) => {
  const strObj1 = JSON.stringify(obj1);
  const strObj2 = JSON.stringify(obj2);

  return strObj1 === strObj2;
}

export const saveStorage = (key, value, needParse = false, persistData = false) => {
  const finalKey = `${PREFIX}${key}`;
  const usedFunc = persistData ? localStorage : sessionStorage;
  const finalValue = needParse ? JSON.stringify(value) : value;

  usedFunc.setItem(finalKey, finalValue);
}

export const loadStorage = (key, needParse = false, dataPersisted = false) => {
  const finalKey = `${PREFIX}${key}`;
  const usedFunc = dataPersisted ? localStorage : sessionStorage;

  const rawValue = usedFunc.getItem(finalKey);

  return needParse ? JSON.parse(rawValue) : rawValue;
}

/**
 * It takes 2 numbers and define if number1 should be before, after or at same position than number2
 * 
 * @param {number} number1
 * @param {number} number2
 * 
 * @returns {number} Value that can be -1, 0 or 1 telling if number1 is lower, equal or higher than number2
 */
export const simplifyOrder = (number1, number2) => {
  const diff = number1 - number2;

  return !diff ? 0 : diff / Math.abs(diff);
}

export const checkPersonalGames = (allResults, gameName) => {
  const localGames = loadStorage("personalGames", true, true);
  const personalResults = {
    ...localGames,
    [gameName]: {}
  };

  if (personalGames[gameName]?.length) {
    allResults.forEach((result) => {
      personalGames[gameName].forEach((gameNumbers) => {
        const numMatches = result.dezenas.filter((number) => gameNumbers.includes(number)).length;

        const previousResult = personalResults[gameName][gameNumbers.join("")] || {
          numbers: [...gameNumbers],
        }
        const _score = previousResult.score || {};

        if (numMatches >= target[gameName].min) {
          if (!_score[numMatches]) {
            _score[numMatches] = [];
          }

          _score[numMatches].push(result.concurso);
        }

        personalResults[gameName][gameNumbers.join("")] = {
          ...previousResult,
          score: {
            ...previousResult.score,
            ..._score,
          },
        };
      })
    })
  }

  try {
    saveStorage("personalGames", personalResults, true, true);
  } catch (error) {
    console.error("Error when trying to save local storage", error);
  }
  return personalResults;
}

export const checkNumbers = (allResults) => {
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

    sumsInfo[soma].push(result.data);

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

  console.table({
    numberInfo,
    sumsInfo,
    personal: checkPersonalGames(allResults, numberInfo.modalidade),
  })
  saveStorage(`score-${numberInfo.modalidade}`, numberInfo, true, true);
}
