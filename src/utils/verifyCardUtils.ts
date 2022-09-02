import * as cardRepository from "../repositories/cardRepository.js";
import moment from "moment";
import Cryptr from "cryptr";
import bcrypt from "bcryptjs";

export function verifyCardHasExpired(card: cardRepository.Card) {
  const dateNow = moment().format("MM/YYYY");

  if (card.expirationDate < dateNow) {
    throw {
      status: 403,
      message: "Esse cartão expirou!",
    };
  }

  return;
}

export function verifySecurityCodeMatch(
  card: cardRepository.Card,
  securityCode: number
) {
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
  const verifySecurityCode = Number(cryptr.decrypt(card.securityCode));
  console.log(verifySecurityCode);

  if (securityCode != verifySecurityCode) {
    throw {
      status: 401,
      message: "Permissão negada!",
    };
  }

  return;
}

export function verifyPasswordMatch(
  card: cardRepository.Card,
  password: string
) {
  const checkPassword = bcrypt.compareSync(password, card.password);

  if (!checkPassword) {
    throw {
      status: 401,
      message: "Permissão negada!",
    };
  }

  return;
}

export function verifyIsCardActive(card: cardRepository.Card) {
  if (card.password) {
    throw {
      status: 403,
      message: "Esse cartão já está ativado!",
    };
  }

  return;
}

export function verifyIsCardInactive(card: cardRepository.Card) {
  if (!card.password) {
    throw {
      status: 403,
      message: "Esse cartão não está ativado!",
    };
  }

  return;
}

export function verifyIsCardBlock(card: cardRepository.Card) {
  if (card.isBlocked) {
    throw {
      status: 403,
      message: "Esse cartão já está bloqueado!",
    };
  }

  return;
}

export function verifyIsCardUnblock(card: cardRepository.Card) {
  if (!card.isBlocked) {
    throw {
      status: 403,
      message: "Esse cartão já está desbloqueado!",
    };
  }

  return;
}
