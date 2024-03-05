import React from "react";
import PropType from "prop-types";
import { useRecoilValue } from "recoil";
import { somaDezenasState } from "../../shared/state";

import styles from "./DetailsModal.module.css";
import { Column } from "@ant-design/charts";

const NUM_FAIXAS_INICIAL = 6;
export const DetailsModal = ({
  className,
  isOpen,
  toggleFunction,
}) => {
  const somaDezenas = useRecoilValue(somaDezenasState);
  const fechaModal = () => {
    toggleFunction();
  }
  const intervalos = React.useMemo(() => {
    const listaSomas = Object.keys(somaDezenas).map((soma) => Number(soma));
    const razaoIntervalo = Math.floor(listaSomas.length / NUM_FAIXAS_INICIAL);
    let contador = 0;
    let finalizou = false;
    const listaIntervalos = [];

    while (!finalizou) {
      const chaveInicio = razaoIntervalo * contador;
      const chaveFim = chaveInicio + razaoIntervalo - 1;
      const elementoInicio = listaSomas[chaveInicio];
      const elementoFim = listaSomas[chaveFim] || listaSomas[listaSomas.length - 1];

      if (!elementoInicio) {
        finalizou = true;
      } else {
        const intervalo = {
          inicio: elementoInicio,
          fim: elementoFim,
          chave: `${elementoInicio}-${elementoFim}`
        };

        listaIntervalos.push(intervalo);
        contador += 1;
      }
    }

    return listaIntervalos;
  }, [somaDezenas])

  const dadosPreparados = React.useMemo(() => {
    const dados = [];
    const listaSomas = Object.keys(somaDezenas).map((soma) => Number(soma));
    const intervalo = (listaSomas[listaSomas.length - 1] - listaSomas[0]) / listaSomas.length;

    console.table({
      listaSomas,
      intervalo,
    });

    if (intervalos?.length) {
      Object.entries(somaDezenas).forEach(([soma, detalhes]) => {
        const dado = {
          soma,
          dezenas: [],
          datas: [],
          totalSorteios: detalhes?.length || 0,
        };

        Object.values(detalhes).forEach((info) => {
          dado.dezenas.push(info.dezenas);
          dado.datas.push(info.data);
        });

        const intervalo = intervalos?.find(({ inicio, fim }) => soma >= inicio && soma <= fim);

        dado.intervalo = intervalo?.chave;

        if (dado.totalSorteios) {
          dados.push(dado);
        }
      });
    }

    return dados;
  }, [intervalos, somaDezenas]);

  console.table({
    dadosPreparados,
    somaDezenas,
    intervalos,
  })

  const configGrafico = {
    data: dadosPreparados,
    xField: "intervalo",
    yField: "totalSorteios",
    isGroup: true,
  }

  return (
    <section
      className={`${styles.modal} ${!isOpen ? "oculto" : ""}`}
    >
      <span className={styles.background} onClick={fechaModal} />

      <div
        className={`${styles.corpo} ${className}`}
      >
        <header>
          <button onClick={fechaModal} className={styles.btnFecha}>&times;</button>
        </header>

        <div className={styles.conteudo}>
          <Column {...configGrafico} className={styles.grafico} />
        </div>
      </div>
    </section>
  )
}

DetailsModal.defaultProps = {
  className: "",
}

DetailsModal.propTypes = {
  className: PropType.string,
  isOpen: PropType.bool.isRequired,
  toggleFunction: PropType.func.isRequired,
}