import * as businessRepository from "../repositories/businessRepository.js";

export async function BusinessIsRegistered(businessId: number) {
  const business = await businessRepository.findById(businessId);

  if (!business) {
    throw {
      status: 400,
      message: "Este estabelecimento não está cadastrado!",
    };
  }

  return business;
}
