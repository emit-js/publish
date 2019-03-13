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
  const { code, out } = await dot.spawn(prop, {
    args: ["describe"],
    command: "git",
    cwd,
  })

  if (cli) {
    dot("logLevel", "cliEmitOutput", { info: "warn" })
  }

  if (code > 0) {
    return { err: true, message: notApplicable, out: false }
  }

  if (out.match(/\.\d+\r\n$/)) {
    return { err: false, message: released, out: true }
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
      return { err: false, message: released, out: true }
    }
  }

  return { err: false, message: notReleased, out: false }
}
