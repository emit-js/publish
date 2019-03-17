/* eslint-env jest */

import { join } from "path"

test("publishDirtyStatus", async () => {
  const dot = require("./dot")()

  const { err, out } = await dot.publishDirtyStatus({
    cwd: join(__dirname, "../"),
  })

  expect(err).toBe(false)
  expect(out).toEqual(expect.any(Boolean))
})

test("publishReadBranch", async () => {
  const dot = require("./dot")()

  const { err, out } = await dot.publishReadBranch({
    cwd: join(__dirname, "../"),
  })

  expect(err).toBe(false)
  expect(out).toEqual(expect.any(String))
})

test("publishReadVersion", async () => {
  const dot = require("./dot")()

  const version = await dot.publishReadVersion({
    cwd: join(__dirname, "../"),
  })

  expect(version).toEqual(expect.any(String))
})

test("publishReleaseStatus", async () => {
  const dot = require("./dot")()

  const { err, out } = await dot.publishReleaseStatus({
    cwd: join(__dirname, "../"),
  })

  expect(err).toBe(false)
  expect(out).toEqual(expect.any(Boolean))
})
