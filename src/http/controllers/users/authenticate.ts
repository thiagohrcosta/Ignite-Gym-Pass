import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { MakeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = MakeAuthenticateUseCase()

    const { user } =await authenticateUseCase.execute({
      email,
      password
    })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        }
      }
    )

    return reply.status(200).send({
      token,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(400).send(
        {
          message: err.message
        }
      )
    } 

    throw err 
  }
}