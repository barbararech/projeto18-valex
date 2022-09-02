import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as companyServices from "../services/companyServices.js";
import * as employeeServices from "../services/employeeServices.js";
import * as verifyCardUtils from "../utils/verifyCardUtils.js";
import { formatName } from "../utils/formatCardholderNameUtils.js";
import { calcBalance } from "../utils/calcBalanceUtils.js";
import { faker } from "@faker-js/faker";
import moment from "moment";
import Cryptr from "cryptr";
import bcrypt from "bcryptjs";

export async function newCard(
  employeeId: number,
  type: cardRepository.TransactionTypes,
  companyKey: string
) {
  const company = await companyServices.findCompany(companyKey);
  const employee = await employeeServices.findEmployee(employeeId);

  await findEmployeeCardByType(type, employeeId);

  await insertNewCardData(company, employee, type);

  return;
}

export async function insertNewCardData(
  company: companyRepository.Company,
  employee: employeeRepository.Employee,
  type: cardRepository.TransactionTypes
) {
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
  const securityCode = cryptr.encrypt(faker.random.numeric(3));

  const cardNumber = faker.random.numeric(16);

  const { fullName } = employee;
  const cardholderName = await formatName(fullName);

  const expirationDate = moment(moment().add(5, "years")).format("MM/YYYY");

  const cardData = {
    employeeId: employee.id,
    number: cardNumber,
    cardholderName,
    securityCode,
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: false,
    type,
  };

  await cardRepository.insert(cardData);

  return;
}

export async function activateCard(
  cardId: number,
  securityCode: number,
  password: string
) {
  const passwordCrypt = bcrypt.hashSync(password, 10);

  const card = await findCardById(cardId);

  verifyCardUtils.verifySecurityCodeMatch(card, securityCode);
  verifyCardUtils.verifyIsCardActive(card);
  verifyCardUtils.verifyCardHasExpired(card);

  const cardData = {
    password: passwordCrypt,
  };

  await cardRepository.update(cardId, cardData);
  return;
}

export async function viewCard(cardId: number, password: string) {
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
  const card = await findCardById(cardId);

  verifyCardUtils.verifyIsCardInactive(card);

  verifyCardUtils.verifyPasswordMatch(card, password);

  let filteredCard = await cardRepository.viewCardDetails(cardId);
  const securityCode = cryptr.decrypt(filteredCard.securityCode);
  filteredCard["securityCode"] = securityCode;

  return [filteredCard];
}

export async function viewTransactions(cardId: number) {
  await findCardById(cardId);

  const recharges = await rechargeRepository.findByCardId(cardId);
  const payments = await paymentRepository.findByCardId(cardId);

  const balance = await calcBalance(recharges, payments);

  const transactions = {
    balance,
    payments,
    recharges,
  };

  return transactions;
}

export async function blockCard(cardId: number, password: string) {
  const card = await findCardById(cardId);

  verifyCardUtils.verifyPasswordMatch(card, password);
  verifyCardUtils.verifyCardHasExpired(card);
  verifyCardUtils.verifyIsCardBlock(card);

  const cardData = {
    isBlocked: true,
  };

  await cardRepository.update(cardId, cardData);
  return;
}

export async function unblockCard(cardId: number, password: string) {
  const card = await findCardById(cardId);

  verifyCardUtils.verifyPasswordMatch(card, password);
  verifyCardUtils.verifyCardHasExpired(card);
  verifyCardUtils.verifyIsCardUnblock(card);

  const cardData = {
    isBlocked: false,
  };

  await cardRepository.update(cardId, cardData);
  return;
}

export async function findEmployeeCardByType(
  type: cardRepository.TransactionTypes,
  employeeId: number
) {
  const cardExist = await cardRepository.findByTypeAndEmployeeId(
    type,
    employeeId
  );

  if (cardExist) {
    throw {
      status: 400,
      message: "Esse empregado já possui um cartão deste tipo!",
    };
  }
  return;
}

export async function findCardById(cardId: number) {
  const card = await cardRepository.findById(cardId);

  if (!card) {
    throw {
      status: 400,
      message: "Esse cartão não existe!",
    };
  }

  return card;
}
