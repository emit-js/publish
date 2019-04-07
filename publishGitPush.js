module.exports = function(emit) {
  if (emit.publishGitPush) {
    return
  }

  emit.any("publishGitPush", publishGitPush)
}

async function publishGitPush(arg, prop, emit) {
  const { branch, cwd } = arg
  return emit.spawn(prop, {
    args: ["push", "origin", branch],
    command: "git",
    cwd,
  })
}
