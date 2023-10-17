import { hash } from 'bcryptjs'
import { InMemoryOrgsRepository } from 'src/repositories/in-memory/in-memory-orgs-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate-use-case'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let orgsRepository: InMemoryOrgsRepository
let useCase: AuthenticateUseCase

const newOrgData = {
  name: 'org name',
  email: 'email@gmail.com',
  password_hash: '',
  city: 'canoas',
  uf: 'rs',
  street: 'org street',
  street_number: '666',
  whatsapp: '5199999999'
}

describe('AUTHENTICATE AS ORG USE CASE', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    useCase = new AuthenticateUseCase(orgsRepository)
  })

  it('should login as org', async () => {
    newOrgData.password_hash = await hash('orgPassword', 8)
    await orgsRepository.create(newOrgData)

    const { org } = await useCase.execute({ email: 'email@gmail.com', password: 'orgPassword' })

    expect(org.email).toEqual('email@gmail.com')
  })

  it('should not be able to login with wrong password', async () => {
    newOrgData.password_hash = await hash('orgPassword', 8)
    await orgsRepository.create(newOrgData)

    expect(() => useCase.execute({ email: 'email@gmail.com', password: 'orgassword' })).rejects.toThrowError(InvalidCredentialsError)
  })

  it('should not be able to login with wrong email', async () => {
    newOrgData.password_hash = await hash('orgPassword', 8)
    await orgsRepository.create(newOrgData)

    expect(() => useCase.execute({ email: 'email2@gmail.com', password: 'orgassword' })).rejects.toThrowError(InvalidCredentialsError)
  })

})