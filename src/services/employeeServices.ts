import * as employeeRepository from "../repositories/employeeRepository.js";

export async function findEmployee(employeeId: number) {
  const employee = await employeeRepository.findById(employeeId);

  if (!employee) {
    throw { status: 401, message: "Esse empregado não está cadastrado!" };
  }

  return employee;
}
