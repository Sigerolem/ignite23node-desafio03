import { InMemoryOrgsRepository } from 'src/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from 'src/repositories/in-memory/in-memory-pets-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetPetInfoUseCase } from './get-pet-info-use-case'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let useCase: GetPetInfoUseCase

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


describe('GET PET DETAILS USE CASE', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    useCase = new GetPetInfoUseCase(petsRepository)
  })

  it('should get pets detail', async () => {
    const { id: orgId } = await orgsRepository.create(newOrgData)
    const { id } = await petsRepository.create({ orgId, petData: newPetData })

    const pet = await useCase.execute(id)

    expect(pet?.id).toEqual(id)
  })

  it('should not get pets detail with wrong id', async () => {
    const { id: orgId } = await orgsRepository.create(newOrgData)
    const { id } = await petsRepository.create({ orgId, petData: newPetData })

    const pet = await useCase.execute('wrongId')

    expect(pet).toEqual(null)
  })

})