import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyServices from "../services/companyServices.js";
import * as employeeServices from "../services/employeeServices.js";
import { formatName } from "../utils/formatCardholderName.js";
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

  const newCard = await newCardData(company, employee, type);

  return;
}

export async function newCardData(
  company: companyRepository.Company,
  employee: employeeRepository.Employee,
  type: cardRepository.TransactionTypes
) {
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

  const cardNumber = faker.random.numeric(16);

  const { fullName } = employee;
  const cardholderName = await formatName(fullName);

  const expirationDate = moment(moment().add(5, "years")).format("MM/YYYY");

  const securityCode = cryptr.encrypt(faker.random.numeric(3));

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
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
  const passwordCrypt = bcrypt.hashSync(password, 10);
  const dateNow = moment().format("MM/YYYY");

  const card = await findCardById(cardId);

  const verifySecurityCode = Number(cryptr.decrypt(card.securityCode));
  console.log(verifySecurityCode)

  if (securityCode != verifySecurityCode) {
    throw {
      status: 401,
      message: "Permissão negada!",
    };
  }

  if (card.password) {
    throw {
      status: 403,
      message: "Esse cartão já está ativado!",
    };
  }

  if (card.expirationDate < dateNow) {
    throw {
      status: 403,
      message: "Esse cartão expirou!",
    };
  }

  const cardData = {
    password: passwordCrypt,
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

export async function viewCard(cardId: number, password: string) {
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
  const card = await findCardById(cardId);

  if (!card.password) {
    throw {
      status: 403,
      message: "Esse cartão não foi ativado!",
    };
  }

  const checkPassword = bcrypt.compareSync(password, card.password);

  if (!checkPassword) {
    throw {
      status: 401,
      message: "Permissão negada!",
    };
  }

  

  let filteredCard = await cardRepository.viewCardDetails(cardId);
  const securityCode = cryptr.decrypt(filteredCard.securityCode);
  filteredCard["securityCode"] = securityCode;

  return [filteredCard];
}
