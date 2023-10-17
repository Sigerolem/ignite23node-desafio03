import { Prisma } from "@prisma/client";
import { OrgsRepository } from "src/repositories/orgs-repository";
import { PetsRepository } from "src/repositories/pets-repository";
import { OrgDoesntExistError } from "./errors/org_doesnt_exist-error";


export class RegisterPetUseCase {
  constructor(private petsRepository: PetsRepository, private orgsRepository: OrgsRepository) { }

  async execute({ orgId, petData }: { orgId: string, petData: Prisma.PetCreateWithoutOrgInput }) {

    const org = await this.orgsRepository.findById(orgId)

    if (!org) {
      throw new OrgDoesntExistError()
    }

    const pet = this.petsRepository.create({ orgId, petData })

    return pet
  }
}