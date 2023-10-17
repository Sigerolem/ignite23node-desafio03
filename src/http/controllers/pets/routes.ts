import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import { registerPet } from './register-pet'
import { getPets } from './get-pets'
import { getPetInfo } from './get-pet-info'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/pets', { onRequest: [verifyJwt] }, registerPet)

  app.get('/pets', getPets)

  app.get('/pets/:id', getPetInfo)
}