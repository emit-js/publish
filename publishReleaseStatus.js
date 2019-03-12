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

  return [false, !!out.match(/\.\d+\r\n$/)]
}
