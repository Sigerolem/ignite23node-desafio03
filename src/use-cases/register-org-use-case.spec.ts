import { InMemoryOrgsRepository } from 'src/repositories/in-memory/in-memory-orgs-repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterOrgUseCase } from './register-org-use-case'
import { compare } from 'bcryptjs'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

let orgsRepository: InMemoryOrgsRepository
let useCase: RegisterOrgUseCase

const newOrgData = {
  name: 'org name',
  email: 'email@gmail.com',
  password: 'orgPassword',
  city: 'canoas',
  uf: 'rs',
  street: 'org street',
  street_number: '666',
  whatsapp: '5199999999'
}

describe('REGISTER ORG USE CASE', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    useCase = new RegisterOrgUseCase(orgsRepository)
  })

  it('should register a org and hash the password', async () => {
    const { org } = await useCase.execute(newOrgData)

    const isHashedPassword = await compare('orgPassword', org.password_hash)

    expect(org.email).toEqual('email@gmail.com')
    expect(isHashedPassword).toEqual(true)
  })

  it('should not be able to register same email twice', async () => {
    await useCase.execute(newOrgData)

    await expect(() => (
      useCase.execute(newOrgData)
    )).rejects.toThrowError(OrgAlreadyExistsError)
  })

})