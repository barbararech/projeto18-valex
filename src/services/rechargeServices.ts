import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as companyServices from "./companyServices.js";
import * as cardServices from "./cardServices.js";
import * as verifyCardUtils from "../utils/verifyCardUtils.js";

export async function newRecharge(
  cardId: number,
  amount: number,
  companyKey: string
) {
  await companyServices.findCompany(companyKey);
  const card = await cardServices.findCardById(cardId);

  verifyCardUtils.verifyIsCardInactive(card);
  verifyCardUtils.verifyCardHasExpired(card);

  await insertRechargeData(cardId, amount);

  return;
}

export async function insertRechargeData(cardId: number, amount: number) {
  const rechargeData = {
    cardId,
    amount,
  };

  await rechargeRepository.insert(rechargeData);

  return;
}
