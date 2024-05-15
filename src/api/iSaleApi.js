import { api } from "../config/network";

export const getAlliSale = async () => {
  const res = await api("iSale", "get");
  return res;
};

export const getISaleDetail = async (id) => {
  const res = await api("iSale/" + id, "get");
  return res;
};
