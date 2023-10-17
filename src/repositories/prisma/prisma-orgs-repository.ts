import { Prisma } from '@prisma/client'
import { prisma } from "src/lib/prisma";
import { OrgsRepository } from "../orgs-repository";
import { OrgAlreadyExistsError } from 'src/use-cases/errors/org-already-exists-error';

export class PrismaOrgsRepository implements OrgsRepository {
  async create(data: Prisma.OrgCreateInput) {
    try {
      const org = await prisma.org.create({ data })
      return org
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new OrgAlreadyExistsError()
      }
      throw error
    }
  }

  async findById(id: string) {
    try {
      const org = await prisma.org.findUnique({
        where: {
          id
        }
      })
      return org
    } catch (error) {
      throw error
    }
  }

  async findByEmail(email: string) {
    try {
      const org = await prisma.org.findUnique({
        where: {
          email
        }
      })
      return org
    } catch (error) {
      throw new Error('Method not implemented.');
    }
  }

  async findManyByCity(city: string) {
    const orgs = await prisma.org.findMany({
      where: {
        city
      }
    })

    return orgs
  }

}