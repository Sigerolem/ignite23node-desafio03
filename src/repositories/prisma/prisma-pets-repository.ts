import { Prisma } from "@prisma/client";
import { PetsRepository } from "../pets-repository";
import { prisma } from "src/lib/prisma";
import { petFilters } from "src/use-cases/get-pets-use-case";

export class PrismaPetsRepository implements PetsRepository {
  async create({ orgId, petData }: { orgId: string, petData: Prisma.PetCreateWithoutOrgInput }) {
    try {
      const pet = await prisma.pet.create({ data: { ...petData, org: { connect: { id: orgId } } } })
      return pet
    } catch (error) {
      throw error
    }
  }

  async getPetDetails(id: string) {
    try {
      const pet = await prisma.pet.findUnique({
        where: {
          id
        },
        include: {
          org: {
            select: {
              whatsapp: true,
              city: true,
              name: true,
              street: true,
            }
          }
        }
      })
      return pet
    } catch (error) {
      throw error
    }
  }

  async findByCity({ city, filters }: { city: string, filters: petFilters }) {
    try {
      const pets = await prisma.pet.findMany({
        where: {
          org: {
            city
          },
          ...filters
        },
        include: {
          org: {
            select: {
              city: true,
              street: true,
            }
          }
        }
      })
      return pets
    } catch (error) {
      throw error
    }
  }
}