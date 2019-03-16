/* eslint-env jest */

import publish from "../dist/publish"
import { join } from "path"

const dot = require("dot-event")()

require("@dot-event/args")(dot)
require("@dot-event/log")(dot)
require("@dot-event/spawn")(dot)

publish(dot)

test("publishDirtyStatus", async () => {
  const cwd = join(__dirname, "../")
  const { err, out } = await dot.publishDirtyStatus({ cwd })
  expect(err).toBe(false)
  expect(out).toEqual(expect.any(Boolean))
})

test("publishReadBranch", async () => {
  const cwd = join(__dirname, "../")
  const { err, out } = await dot.publishReadBranch({
    cwd,
  })
  expect(err).toBe(false)
  expect(out).toEqual(expect.any(String))
})

test("publishReadVersion", async () => {
  const cwd = join(__dirname, "../")
  const version = await dot.publishReadVersion({
    cwd,
  })
  expect(version).toEqual(expect.any(String))
})

test("publishReleaseStatus", async () => {
  const cwd = join(__dirname, "../")
  const { err, out } = await dot.publishReleaseStatus({
    cwd,
  })
  expect(err).toBe(false)
  expect(out).toEqual(expect.any(Boolean))
})
