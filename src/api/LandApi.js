import { api } from "../config/network";

export const getAllLand = async () => {
  const res = await api("lands", "get");
  return res;
};

export const getLandDetail = async (landId) => {
  const res = await api(`lands/${landId}`, "get");
  return res;
};

export const getLandPrice = async (landId) => {
  const res = await api(`lands/price/${landId}`, "get");
  return res;
};

export const addOrDeleteInterestLand = async (id) => {
  const res = await api(`/lands/interests/${id}`, "post");
  return res;
};
