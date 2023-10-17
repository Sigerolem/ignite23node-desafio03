import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaPetsRepository } from "src/repositories/prisma/prisma-pets-repository";
import { GetPetsUseCase } from "src/use-cases/get-pets-use-case";
import { z } from "zod";

export async function getPets(request: FastifyRequest, reply: FastifyReply) {
  const getPetsBodySchema = z.object({
    city: z.string(),
    uf: z.string().length(2),
    age: z.enum(['YOUNG', 'TEEN', 'ADULT']).optional(),
    energy_level: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    independency: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    size: z.enum(['SMALL', 'MEDIUM', 'BIG']).optional(),
    space_need: z.enum(['SMALL', 'MEDIUM', 'BIG']).optional(),
  })

  const petsRepository = new PrismaPetsRepository()
  const getPetsUseCase = new GetPetsUseCase(petsRepository)

  try {
    const { city, uf, ...filters } = getPetsBodySchema.parse(request.query)
    const pets = await getPetsUseCase.execute({ city, uf, filters })
    reply.status(200).send({ pets })
  } catch (error) {
    reply.status(500).send({ error })
    throw error
  }

}