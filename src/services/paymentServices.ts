import * as paymentRepository from "../repositories/paymentRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as cardServices from "./cardServices.js";
import * as verifyCardUtils from "../utils/verifyCardUtils.js";
import * as businessServices from "../services/businessServices.js";

export async function newPayment(
  cardId: number,
  cardPassword: string,
  businessId: number,
  amount: number
) {
  const card = await cardServices.findCardById(cardId);
  const business = await businessServices.BusinessIsRegistered(businessId);

  verifyCardUtils.verifyIsCardInactive(card);
  verifyCardUtils.verifyPasswordMatch(card, cardPassword);
  verifyCardUtils.verifyCardHasExpired(card);
  verifyCardUtils.verifyIsCardBlock(card);

  await verifyCardUtils.CardAndBusinessHaveSameType(card, business);

  await cardHasEnoughBalance(card, amount);

  await insertPaymentData(cardId, businessId, amount);

  return;
}

export async function insertPaymentData(
  cardId: number,
  businessId: number,
  amount: number
) {
  const paymentData = {
    cardId,
    businessId,
    amount,
  };

  await paymentRepository.insert(paymentData);

  return;
}

export async function cardHasEnoughBalance(
  card: cardRepository.Card,
  amount: number
) {
  const { balance } = await cardServices.viewTransactions(card.id);

  if (balance < amount) {
    throw {
      status: 400,
      message: "Este cartão não possui saldo suficiente!",
    };
  }

  return;
}
