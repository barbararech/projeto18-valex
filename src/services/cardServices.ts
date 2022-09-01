import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyServices from "../services/companyServices.js";
import * as employeeServices from "../services/employeeServices.js";
import { formatName } from "../utils/formatCardholderName.js";
import { faker } from "@faker-js/faker";
import moment from "moment";
import Cryptr from "cryptr";

export async function newCard(
  employeeId: number,
  type: cardRepository.TransactionTypes,
  companyKey: string
) {
  const company = await companyServices.findCompany(companyKey);
  const employee = await employeeServices.findEmployee(employeeId);
 
  await findEmployeeCardByType(type, employeeId);

  const newCard = await cardData(company, employee, type);

  return;
}

export async function cardData(
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
