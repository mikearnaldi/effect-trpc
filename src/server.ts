import { createHTTPServer } from "@trpc/server/adapters/standalone"
import * as z from "zod"

import { db } from "./db.js"
import { publicProcedure, router } from "./trpc.js"

const appRouter = router({
  userList: publicProcedure
    .query(async () => {
      const users = await db.user.findMany()
      return users
    }),
  userById: publicProcedure
    .input(z.string())
    .query(async (opts) => {
      const { input } = opts
      const user = await db.user.findById(input)
      return user
    }),
  userCreate: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts
      const user = await db.user.create(input)
      return user
    })
})

export type AppRouter = typeof appRouter

export function startServer(port: number) {
  const server = createHTTPServer({
    router: appRouter
  })
  server.listen(port)
  return server
}

// Run server if this file is executed directly
if (import.meta.main) {
  startServer(3000)
  console.log("Server listening on http://localhost:3000")
}
