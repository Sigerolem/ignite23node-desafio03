import { InMemoryOrgsRepository } from 'src/repositories/in-memory/in-memory-orgs-repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterPetUseCase } from './register-pet-use-case'
import { InMemoryPetsRepository } from 'src/repositories/in-memory/in-memory-pets-repository'
import { OrgDoesntExistError } from './errors/org_doesnt_exist-error'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let useCase: RegisterPetUseCase

const newOrgData = {
  name: 'org name',
  email: 'email@gmail.com',
  password_hash: 'orgPassword',
  city: 'canoas',
  uf: 'rs',
  street: 'org street',
  street_number: '666',
  whatsapp: '5199999999'
}

const newPetData = {
  name: "pet name",
  about: "about pet",
  age: "ADULT",
  size: "SMALL",
  energy_level: "HIGH",
  independency: "HIGH",
  space_need: "SMALL",
} as const

describe('REGISTER PET USE CASE', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    useCase = new RegisterPetUseCase(petsRepository, orgsRepository)
  })

  it('should register a pet', async () => {
    const { id } = await orgsRepository.create(newOrgData)
    const { org_id } = await useCase.execute({ orgId: id, petData: newPetData })

    expect(org_id).toEqual(id)
  })

  it('should not be able to register pet without org_id', async () => {
    expect(() => useCase.execute({ orgId: 'asddsf', petData: newPetData })).rejects.toThrowError(OrgDoesntExistError)
  })

})