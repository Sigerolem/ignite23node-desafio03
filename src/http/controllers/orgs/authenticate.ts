import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaOrgsRepository } from "src/repositories/prisma/prisma-orgs-repository";
import { AuthenticateUseCase } from "src/use-cases/authenticate-use-case";
import { InvalidCredentialsError } from "src/use-cases/errors/invalid-credentials-error";
import { z } from "zod";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string(),
    password: z.string().min(5)
  })

  try {
    const { email, password } = authenticateBodySchema.parse(request.body)
    const orgsRepository = new PrismaOrgsRepository()
    const authenticateUseCase = new AuthenticateUseCase(orgsRepository)

    const { org } = await authenticateUseCase.execute({ email, password })

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
      .send({ id: org.id, token })

  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }
    console.log(error)
    throw error
  }

}