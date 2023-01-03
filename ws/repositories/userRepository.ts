import { prisma } from "./prisma"

export function findUserByUsername(username: string) {
  if(!username) {
    return null
  }
  return prisma.user.findUnique({ 
    where: { 
      username
    } 
  })
}

export function findUserById(id: string) {
  if(!id) {
    return null
  }
  return prisma.user.findUnique({ 
    where: { 
      id
    } 
  })
}