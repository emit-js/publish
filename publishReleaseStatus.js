import { relative } from "path"

const released = "✅ published"
const notReleased = "❌ unreleased"
const notApplicable = "🤔 n/a"

module.exports = function(emit) {
  if (emit.publishReleaseStatus) {
    return
  }

  emit.any("publishReleaseStatus", publishReleaseStatus)
}

async function publishReleaseStatus(arg, prop, emit) {
  const { cli, cwd } = arg

  if (cli) {
    emit("logLevel", "publishStatus", { debug: "info" })
    emit("logLevel", "spawnOutput", { info: "debug" })
  }

  const { err, out } = await emit.spawn(prop, {
    args: ["describe"],
    command: "git",
    cwd,
  })

  const rel = relative(process.cwd(), cwd)

  if (err && out.match(/not a git repository/)) {
    emit("publishStatus", rel, {
      level: "warn",
      message: notApplicable,
    })
    return { err: true, out: false }
  }

  if (out.match(/\.\d+\r\n$/)) {
    emit("publishStatus", rel, released)
    return { err: false, out: true }
  }

  const oneAway = !!out.match(/\.\d+-1-/)

  if (oneAway) {
    const {
      err,
      out: msg,
    } = await emit.publishReadLastCommit({
      cwd,
    })
    if (!err && msg.match(/\rpackage-lock\.json/)) {
      emit("publishStatus", rel, released)
      return { err: false, message: released, out: true }
    }
  }

  emit("publishStatus", rel, notReleased)
  return { err: false, message: notReleased, out: false }
}
