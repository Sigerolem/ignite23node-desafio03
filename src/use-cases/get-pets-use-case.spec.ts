import { InMemoryOrgsRepository } from 'src/repositories/in-memory/in-memory-orgs-repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterPetUseCase } from './register-pet-use-case'
import { InMemoryPetsRepository } from 'src/repositories/in-memory/in-memory-pets-repository'
import { OrgDoesntExistError } from './errors/org_doesnt_exist-error'
import { GetPetsUseCase } from './get-pets-use-case'
import { c } from 'vitest/dist/reporters-5f784f42'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let useCase: GetPetsUseCase

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

const newOrgData2 = {
  name: 'org name',
  email: 'email2@gmail.com',
  password_hash: 'orgPassword',
  city: 'porto alegre',
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

const newPetData2 = {
  name: "pet name",
  about: "about pet",
  age: "ADULT",
  size: "SMALL",
  energy_level: "LOW",
  independency: "HIGH",
  space_need: "BIG",
} as const

describe('GET PETS USE CASE', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    useCase = new GetPetsUseCase(petsRepository)
  })

  it('should get pets with city', async () => {
    const { id } = await orgsRepository.create(newOrgData)
    const { id: id2 } = await orgsRepository.create(newOrgData2)
    await petsRepository.create({ orgId: id, petData: newPetData })
    await petsRepository.create({ orgId: id, petData: newPetData2 })
    await petsRepository.create({ orgId: id2, petData: newPetData })
    await petsRepository.create({ orgId: id2, petData: newPetData2 })

    const pets = await useCase.execute({ city: 'canoas', filters: {} })

    expect(pets.length).toEqual(2)
  })

  it('should get pets with filters', async () => {
    const { id } = await orgsRepository.create(newOrgData)
    await petsRepository.create({ orgId: id, petData: newPetData })
    await petsRepository.create({ orgId: id, petData: newPetData2 })
    await petsRepository.create({ orgId: id, petData: newPetData })
    await petsRepository.create({ orgId: id, petData: newPetData2 })

    const pets = await useCase.execute({ city: 'canoas', filters: { energy_level: "LOW", space_need: "BIG" } })

    expect(pets.length).toEqual(2)
  })

})