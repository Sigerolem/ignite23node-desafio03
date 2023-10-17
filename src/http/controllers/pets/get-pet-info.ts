import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaPetsRepository } from "src/repositories/prisma/prisma-pets-repository";
import { GetPetInfoUseCase } from "src/use-cases/get-pet-info-use-case";
import { z } from "zod";

export async function getPetInfo(request: FastifyRequest, reply: FastifyReply) {
  const getPetInfoParamsSchema = z.object({
    id: z.string()
  })

  const { id } = getPetInfoParamsSchema.parse(request.params)

  const petsRepository = new PrismaPetsRepository()
  const getPetInfoUseCase = new GetPetInfoUseCase(petsRepository)

  try {
    const pet = await getPetInfoUseCase.execute(id)
    reply.send({ pet })
  } catch (error) {
    reply.status(500).send({ error })
    throw error
  }

}