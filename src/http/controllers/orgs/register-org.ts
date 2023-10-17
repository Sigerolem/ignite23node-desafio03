import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaOrgsRepository } from "src/repositories/prisma/prisma-orgs-repository";
import { OrgAlreadyExistsError } from "src/use-cases/errors/org-already-exists-error";
import { RegisterOrgUseCase } from "src/use-cases/register-org-use-case";
import { z } from "zod";

export async function registerOrg(request: FastifyRequest, reply: FastifyReply) {
  const registerOrgBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    whatsapp: z.string(),
    city: z.string(),
    uf: z.string().length(2),
    street: z.string(),
    street_number: z.string(),
  })

  const orgData = registerOrgBodySchema.parse(request.body)

  try {
    const orgsRepository = new PrismaOrgsRepository()
    const registerOrgUseCase = new RegisterOrgUseCase(orgsRepository)

    const { org } = await registerOrgUseCase.execute(orgData)

    const token = await reply.jwtSign({}, {
      sign: {
        sub: org.id
      }
    })

    const refreshToken = await reply.jwtSign({}, {
      sign: {
        sub: org.id,
        expiresIn: '7d'
      }
    })

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true
      })
      .status(201)
      .send({ id: org.id, token })

  } catch (error) {
    if (error instanceof OrgAlreadyExistsError) {
      reply.status(409).send({ message: error.message })
    }
    reply.send(error)
  }

}

