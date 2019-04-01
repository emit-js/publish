import { relative } from "path"

const released = "✅ published"
const notReleased = "❌ unreleased"
const notApplicable = "🤔 n/a"

module.exports = function(dot) {
  if (dot.publishReleaseStatus) {
    return
  }

  dot.any("publishReleaseStatus", publishReleaseStatus)
}

async function publishReleaseStatus(prop, arg, dot) {
  const { cli, cwd } = arg

  if (cli) {
    dot("logLevel", "publishStatus", { debug: "info" })
    dot("logLevel", "spawnOutput", { info: "debug" })
  }

  const { err, out } = await dot.spawn(prop, {
    args: ["describe"],
    command: "git",
    cwd,
  })

  const rel = relative(process.cwd(), cwd)

  if (err && out.match(/not a git repository/)) {
    dot("publishStatus", rel, {
      level: "warn",
      message: notApplicable,
    })
    return { err: true, out: false }
  }

  if (out.match(/\.\d+\r\n$/)) {
    dot("publishStatus", rel, {
      arg: released,
    })
    return { err: false, out: true }
  }

  const oneAway = !!out.match(/\.\d+-1-/)

  if (oneAway) {
    const {
      err,
      out: msg,
    } = await dot.publishReadLastCommit({
      cwd,
    })
    if (!err && msg.match(/\rpackage-lock\.json/)) {
      dot("publishStatus", rel, {
        arg: released,
      })
      return { err: false, message: released, out: true }
    }
  }

  dot("publishStatus", rel, {
    arg: notReleased,
  })
  return { err: false, message: notReleased, out: false }
}
