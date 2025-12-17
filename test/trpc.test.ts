import { createTRPCClient, httpBatchLink } from "@trpc/client"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import type { AppRouter } from "../src/server.js"
import { startServer } from "../src/server.js"

let server: ReturnType<typeof startServer>

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3001"
    })
  ]
})

beforeAll(() => {
  server = startServer(3001)
})

afterAll(() => {
  server.close()
})

describe("tRPC", () => {
  it("userCreate creates a user", async () => {
    const user = await trpc.userCreate.mutate({ name: "Alice" })
    expect(user).toEqual({ id: "1", name: "Alice" })
  })

  it("userCreate creates another user", async () => {
    const user = await trpc.userCreate.mutate({ name: "Bob" })
    expect(user).toEqual({ id: "2", name: "Bob" })
  })

  it("userList returns all users", async () => {
    const users = await trpc.userList.query()
    expect(users).toEqual([
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" }
    ])
  })

  it("userById returns user by ID", async () => {
    const user = await trpc.userById.query("1")
    expect(user).toEqual({ id: "1", name: "Alice" })
  })

  it("userById returns undefined for non-existent user", async () => {
    const user = await trpc.userById.query("999")
    expect(user).toBeUndefined()
  })
})
