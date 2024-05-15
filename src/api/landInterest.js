import { api } from "../config/network";

export const getInterestland = async () => {
  const res = await api("lands/interests", "get");
  return res;
};