import { Org } from '@prisma/client'
import { OrgsRepository } from 'src/repositories/orgs-repository';
import { Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error';

interface RegisterOrgUseCaseRequest extends Omit<Prisma.OrgCreateInput, 'password_hash'> {
  password: string
}

interface RegisterOrgUseCaseResponse {
  org: Org
}

export class RegisterOrgUseCase {
  constructor(private orgRespository: OrgsRepository) { }

  async execute(registerData: RegisterOrgUseCaseRequest): Promise<RegisterOrgUseCaseResponse> {
    const password_hash = await hash(registerData.password, 8)

    const data = {
      ...registerData,
      password: undefined,
      password_hash
    }

    try {
      const org = await this.orgRespository.create(data)
      return { org }

    } catch (error) {
      throw new OrgAlreadyExistsError()
    }


  }
}