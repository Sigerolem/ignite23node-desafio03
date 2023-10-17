import { env } from "./env";
import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import cookie from '@fastify/cookie'
import { orgsRoutes } from "./http/controllers/orgs/routes";
import { petsRoutes } from "./http/controllers/pets/routes";

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false
  },
  sign: {
    expiresIn: '30m'
  }
})

app.register(cookie)

app.register(orgsRoutes)
app.register(petsRoutes)