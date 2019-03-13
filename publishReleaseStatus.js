module.exports = function(dot) {
  if (dot.publishReleaseStatus) {
    return
  }

  dot.any("publishReleaseStatus", publishReleaseStatus)
}

async function publishReleaseStatus(prop, arg, dot) {
  const { cwd } = arg
  const { code, out } = await dot.spawn(prop, {
    args: ["describe"],
    command: "git",
    cwd,
  })

  if (code > 0) {
    return { err: true, out: false }
  }

  const released = !!out.match(/\.\d+\r\n$/)

  if (released) {
    return { err: false, out: true }
  }

  const oneAway = !!out.match(/\.\d+-1-/)

  if (oneAway) {
    const [err, msg] = await dot.publishReadLastCommit({
      cwd,
    })
    if (!err && msg.match(/\rpackage-lock\.json/)) {
      return { err: false, out: true }
    }
  }

  return { err: false, out: false }
}
