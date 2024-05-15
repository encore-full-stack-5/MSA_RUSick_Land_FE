import { api } from "../config/network";

export const getInterestiSale = async () => {
  const res = await api("iSale/interest", "get");
  return res;
};