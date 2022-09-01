import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import { faker } from "@faker-js/faker";
import moment from "moment";
import Cryptr from "cryptr";

export async function newCard(
  employeeId: number,
  type: cardRepository.TransactionTypes,
  companyKey: string
) {
  const company = await FindCompany(companyKey);
  const employee = await FindEmployee(employeeId);
  const cardExist = await FindEmployeeCardByType(type, employeeId);

  const newCard = await addCard(company, employee, type);

  return;
}

export async function FindCompany(companyKey: string) {
  const company = await companyRepository.findByApiKey(companyKey);

  if (!company) {
    throw { status: 401, message: "Esse empregado não está cadastrado!" };
  }

  return company;
}

export async function FindEmployee(employeeId: number) {
  const employee = await employeeRepository.findById(employeeId);

  if (!employee) {
    throw { status: 401, message: "Esse empregado não está cadastrado!" };
  }

  return employee;
}

export async function FindEmployeeCardByType(
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

export async function addCard(
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

export async function formatName(fullName: string) {
  let names = fullName.split(" ");
  const firstName = names[0];
  const lastName = names[names.length - 1];

  names.shift();
  names.pop();
  let formattedNames = [];

  names.forEach((middleName, index) => {
    if (middleName.length > 3) {
      middleName = middleName.charAt(0).toUpperCase();
      formattedNames.push(middleName);
    }
  });

  return `${firstName} ${formattedNames.join(" ")} ${lastName}`;
}
