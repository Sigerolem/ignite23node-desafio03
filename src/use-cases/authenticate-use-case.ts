import { OrgsRepository } from "src/repositories/orgs-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

export class AuthenticateUseCase {
  constructor(private orgsRepository: OrgsRepository) { }

  async execute({ email, password }: AuthenticateUseCaseRequest) {
    const org = await this.orgsRepository.findByEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatch = await compare(password, org.password_hash)

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    return { org }
  }
}