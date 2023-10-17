import { Pet, Prisma } from '@prisma/client'
import { petFilters } from 'src/use-cases/get-pets-use-case'

export interface PetsRepository {
  create({ orgId, petData }: { orgId: string, petData: Prisma.PetCreateWithoutOrgInput }): Promise<Pet>
  findByCity({ city, filters }: { city: string, filters: petFilters }): Promise<Pet[]>
  getPetDetails(id: string): Promise<Pet | null>
  // findByOrg(email: string): Promise<Pet | null>
}