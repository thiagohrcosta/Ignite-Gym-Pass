import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";

class InMemoryUserRepository implements UsersRepository {
  findByEmail(email: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    throw new Error("Method not implemented.");
  }
}