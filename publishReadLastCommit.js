module.exports = function(dot) {
  if (dot.publishReadLastCommit) {
    return
  }

  dot.any("publishReadLastCommit", publishReadLastCommit)
}

async function publishReadLastCommit(prop, arg, dot) {
  const { cwd } = arg
  const { code, out } = await dot.spawn(prop, {
    args: ["log", "-1", "--pretty=%B"],
    command: "git",
    cwd,
  })
  return { err: code > 0, out }
}
