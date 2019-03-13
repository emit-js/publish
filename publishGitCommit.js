module.exports = function(dot) {
  if (dot.publishGitCommit) {
    return
  }

  dot.any("publishGitCommit", publishGitCommit)
}

async function publishGitCommit(prop, arg, dot) {
  const { cwd, message } = arg

  var dirty, err, out
  ;({ err, out: dirty } = await dot.publishDirtyStatus(
    prop,
    {
      cwd,
    }
  ))

  if (!err && dirty) {
    ;({ err, out } = await dot.spawn(prop, {
      args: ["commit", "-a", "-m", message],
      command: "git",
      cwd,
    }))

    return { dirty, err, out }
  }

  return { dirty, err, out }
}
