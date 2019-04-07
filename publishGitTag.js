module.exports = function(emit) {
  if (emit.publishGitTag) {
    return
  }

  emit.any("publishGitTag", publishGitTag)
}

async function publishGitTag(arg, prop, emit) {
  const { cwd, newVersion } = arg
  return await emit.spawn(prop, {
    args: ["tag", "-a", "-m", newVersion, newVersion],
    command: "git",
    cwd,
  })
}
