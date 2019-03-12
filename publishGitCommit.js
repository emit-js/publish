module.exports = function(dot) {
  if (dot.publishGitCommit) {
    return
  }

  dot.any("publishGitCommit", publishGitCommit)
}

async function publishGitCommit(prop, arg, dot) {
  const { cwd, newVersion } = arg
  const { code, out } = await dot.spawn(prop, {
    args: ["commit", "-a", "-m", newVersion],
    command: "git",
    cwd,
  })
  return [code > 0, out]
}
