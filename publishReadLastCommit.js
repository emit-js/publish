module.exports = function(dot) {
  if (dot.publishReadLastCommit) {
    return
  }

  dot.any("publishReadLastCommit", publishReadLastCommit)
}

async function publishReadLastCommit(prop, arg, dot) {
  const { cwd } = arg
  return await dot.spawn(prop, {
    args: ["log", "-1", "--pretty=%B"],
    command: "git",
    cwd,
  })
}
