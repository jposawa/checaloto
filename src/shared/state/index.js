import { atom } from "recoil";
import { PREFIX } from "../constants";

export const somaDezenasState = atom({
  key: `${PREFIX}somaDezenas`,
  default: {},
});
