import { Pet, Prisma } from "@prisma/client";
import { PetsRepository } from "../pets-repository";
import { petFilters } from "src/use-cases/get-pets-use-case";
import { randomUUID } from "node:crypto";
import { OrgsRepository } from "../orgs-repository";

export class InMemoryPetsRepository implements PetsRepository {

  constructor(public orgsRepository: OrgsRepository) { }

  public db: Pet[] = []


  async create({ orgId, petData }: { orgId: string, petData: Prisma.PetCreateWithoutOrgInput }) {
    const pet = {
      id: randomUUID(),
      requirements: petData.requirements ?? null,
      org_id: orgId,
      ...petData
    }
    this.db.push(pet)
    return pet
  }

  async getPetDetails(id: string) {
    const pet = this.db.find(pet => pet.id === id)
    return pet ?? null
  }

  async findByCity({ city, filters }: { city: string, uf: string, filters: petFilters }) {
    const orgs = (await this.orgsRepository.findManyByCity(city)).reduce((acc, org) => [org.id, ...acc], [] as string[])

    this.db = this.db.filter(pet => orgs.includes(pet.org_id))

    const filterOptions = Object.keys(filters) as (keyof typeof filters)[]

    filterOptions.forEach((filterOption) => {
      if (filters[filterOption] !== undefined) {
        this.db = this.db.filter(pet => pet[filterOption] === filters[filterOption])
      }
    })

    // if (filters.age) {
    //   this.db.filter(pet => pet.age === city)
    // }
    // if (filters.energy_level) {
    //   this.db.filter(pet => pet.energy_level === city)
    // }
    // if (filters.independency) {
    //   this.db.filter(pet => pet.independency === city)
    // }
    // if (filters.size) {
    //   this.db.filter(pet => pet.size === city)
    // }
    // if (filters.space_need) {
    //   this.db.filter(pet => pet.space_need === city)
    // }

    return this.db
  }
}