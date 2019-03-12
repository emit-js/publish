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
    return [true, out]
  }

  const released = !!out.match(/\.\d+\r\n$/)

  if (released) {
    return [false, true]
  }

  const oneAway = !!out.match(/\.\d+-1-/)

  if (oneAway) {
    const [err, msg] = await dot.publishReadLastCommit({
      cwd,
    })
    if (!err && msg.match(/\rpackage-lock\.json/)) {
      return [false, true]
    }
  }

  return [false, false]
}
