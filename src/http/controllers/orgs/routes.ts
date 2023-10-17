import { FastifyInstance } from 'fastify'
import { registerOrg } from './register-org'
import { authenticate } from './authenticate'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', registerOrg)
  app.post('/sessions', authenticate)

}