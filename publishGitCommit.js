module.exports = function(dot) {
  if (dot.publishGitCommit) {
    return
  }

  dot.any("publishGitCommit", publishGitCommit)
}

async function publishGitCommit(prop, arg, dot) {
  const { cwd, message } = arg
  const { code, out } = await dot.spawn(prop, {
    args: ["commit", "-a", "-m", message],
    command: "git",
    cwd,
  })
  return [code > 0, out]
}
