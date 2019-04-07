module.exports = function(emit) {
  if (emit.publishReadLastCommit) {
    return
  }

  emit.any("publishReadLastCommit", publishReadLastCommit)
}

async function publishReadLastCommit(arg, prop, emit) {
  const { cwd } = arg
  return await emit.spawn(prop, {
    args: ["log", "-1", "--pretty=%B"],
    command: "git",
    cwd,
  })
}
