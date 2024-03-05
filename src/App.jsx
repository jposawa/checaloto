import React from 'react'
import styles from './App.module.css'
import { useLoto } from './hooks'
import { DetailsModal, GameOptions, ResultSection } from './components';
import { GAME_TYPES } from './shared/constants';

function App() {
  const { data: lotoResult, getLotoResult, isLoading } = useLoto();
  const [hasNumbersData, setHasNumbersData] = React.useState(false);
  const [mostraDetalhes, defineMostraDetalhes] = React.useState(false);
  const optionRef = React.useRef();

  const callResult = (showAll) => {
    const selectedLoto = optionRef?.current?.value || GAME_TYPES[0].id;
    getLotoResult(selectedLoto, {
      showAll,
      forceFetch: showAll,
    });

    if (showAll) {
      // I didn't put the state equal to showAll because if I pass the same game but only with latest result, I will still have the all numbers data
      setHasNumbersData(true);
    }
  }

  const showNumbersData = () => {
    defineMostraDetalhes(true);
  }

  return (
    <>
      <main className={styles.mainContainer}>
        <GameOptions
          disabled={isLoading}
          ref={optionRef}
        />

        <div className={styles.buttonsContainer}>
          <button onClick={() => callResult()}>
            Último resultado
          </button>

          <button onClick={() => callResult(true)}>
            Todos resultados
          </button>

          {hasNumbersData && (
            <button onClick={showNumbersData}>
              Dados números
            </button>
          )}
        </div>

        <ResultSection
          result={lotoResult}
          isLoading={isLoading}
        />

        <DetailsModal
          isOpen={mostraDetalhes}
          toggleFunction={defineMostraDetalhes}
        />
      </main>
    </>
  )
}

export default App
