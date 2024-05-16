import { api } from "../config/network";

export const getAlliSale = async () => {
  const res = await api("iSale", "get");
  return res;
};

export const getISaleDetail = async (id) => {
  const res = await api("iSale/" + id, "get");
  return res;
};

export const addInterestISale = async (id) => {
  await api("iSale/" + id + "/interest", "post");
  // alert("관심 분양이 업데이트 됐습니다.");
};

export const iSaleInTable = async (id) => {
  const res = await api("iSale/" + id + "/interest", "get");
  return res;
};

export const enrollISale = async (id, body) => {
  await api("iSale/" + id + "/enroll", "post", body);
};
