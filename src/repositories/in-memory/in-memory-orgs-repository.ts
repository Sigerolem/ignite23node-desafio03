import { Org, Prisma } from "@prisma/client";
import { OrgsRepository } from "../orgs-repository";
import { randomUUID } from "node:crypto";
import { OrgAlreadyExistsError } from "src/use-cases/errors/org-already-exists-error";


export class InMemoryOrgsRepository implements OrgsRepository {
  public db: Org[] = []

  async create(data: Prisma.OrgCreateInput) {
    const isUniqueEmail = this.db.findIndex(org => org.email == data.email)

    if (isUniqueEmail !== -1) {
      throw new OrgAlreadyExistsError()
    }

    const newOrg = {
      id: randomUUID(),
      created_at: new Date(),
      ...data,
    } as Org
    this.db.push(newOrg)

    return newOrg
  }

  async findByEmail(email: string) {
    const org = this.db.find(org => org.email === email)

    return org ?? null
  }

  async findById(id: string) {
    const org = this.db.find(org => org.id === id)

    return org ?? null
  }

  async findManyByCity(city: string) {
    const orgs = this.db.filter(org => org.city === city)

    return orgs
  }

}