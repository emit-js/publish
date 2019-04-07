module.exports = function(emit) {
  if (emit.publishGitCommit) {
    return
  }

  emit.any("publishGitCommit", publishGitCommit)
}

async function publishGitCommit(arg, prop, emit) {
  const { cwd, message } = arg

  var dirty, err, out
  ;({ err, out: dirty } = await emit.publishDirtyStatus(
    prop,
    {
      cwd,
    }
  ))

  if (!err && dirty) {
    ;({ err, out } = await emit.spawn(prop, {
      args: ["commit", "-a", "-m", message],
      command: "git",
      cwd,
    }))

    return { dirty, err, out }
  }

  return { dirty, err, out }
}
