/* eslint-env jest */

import publish from "../dist/publish"
import { join } from "path"

const dot = require("dot-event")()

require("@dot-event/log")(dot)
require("@dot-event/spawn")(dot)

publish(dot)

test("publishDirtyStatus", async () => {
  const cwd = join(__dirname, "../")
  const [err, dirty] = await dot.publishDirtyStatus({ cwd })
  expect(err).toBe(false)
  expect(dirty).toEqual(expect.any(Boolean))
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
  const [err, status] = await dot.publishReleaseStatus({
    cwd,
  })
  expect(err).toBe(false)
  expect(status).toEqual(expect.any(Boolean))
})
