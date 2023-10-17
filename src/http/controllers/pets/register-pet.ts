import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaOrgsRepository } from "src/repositories/prisma/prisma-orgs-repository";
import { PrismaPetsRepository } from "src/repositories/prisma/prisma-pets-repository";
import { OrgDoesntExistError } from "src/use-cases/errors/org_doesnt_exist-error";
import { RegisterPetUseCase } from "src/use-cases/register-pet-use-case";
import { z } from "zod";

export async function registerPet(request: FastifyRequest, reply: FastifyReply) {
  const registerPetBodySchema = z.object({
    name: z.string(),
    about: z.string(),
    age: z.enum(['YOUNG', 'TEEN', 'ADULT']),
    energy_level: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    independency: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    size: z.enum(['SMALL', 'MEDIUM', 'BIG']),
    space_need: z.enum(['SMALL', 'MEDIUM', 'BIG']),
    requirements: z.string().optional(),
  })

  try {
    const orgId = request.user.sub
    const petData = registerPetBodySchema.parse(request.body)

    const petsRepository = new PrismaPetsRepository
    const orgsRepository = new PrismaOrgsRepository
    const registerPetUseCase = new RegisterPetUseCase(petsRepository, orgsRepository)

    const pet = await registerPetUseCase.execute({ orgId, petData })

    reply.status(201).send(pet)

  } catch (error) {
    if (error instanceof OrgDoesntExistError) {
      reply.status(400).send(error.message)
    }
    reply.status(500).send(error)
  }
}
