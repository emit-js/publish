module.exports = function(dot) {
  if (dot.publishGitPush) {
    return
  }

  dot.any("publishGitPush", publishGitPush)
}

async function publishGitPush(prop, arg, dot) {
  const { branch, cwd } = arg
  return dot.spawn(prop, {
    args: ["push", "origin", branch],
    command: "git",
    cwd,
  })
}
