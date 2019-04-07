/* eslint-env jest */

import { join } from "path"

test("publishDirtyStatus", async () => {
  const emit = require("./emit")()

  const { err, out } = await emit.publishDirtyStatus({
    cwd: join(__dirname, "../"),
  })

  expect(err).toBe(false)
  expect(out).toEqual(expect.any(Boolean))
})

test("publishReadBranch", async () => {
  const emit = require("./emit")()

  const { err, out } = await emit.publishReadBranch({
    cwd: join(__dirname, "../"),
  })

  expect(err).toBe(false)
  expect(out).toEqual(expect.any(String))
})

test("publishReadVersion", async () => {
  const emit = require("./emit")()

  const version = await emit.publishReadVersion({
    cwd: join(__dirname, "../"),
  })

  expect(version).toEqual(expect.any(String))
})

test("publishReleaseStatus", async () => {
  const emit = require("./emit")()

  const { err, out } = await emit.publishReleaseStatus({
    cwd: join(__dirname, "../"),
  })

  expect(err).toBe(false)
  expect(out).toEqual(expect.any(Boolean))
})
