module.exports = function(dot) {
  if (dot.publishGitCommit) {
    return
  }

  dot.any("publishGitCommit", publishGitCommit)
}

async function publishGitCommit(prop, arg, dot) {
  const { cwd, message } = arg

  var code, err, out
  ;({ err, out } = await dot.publishDirtyStatus(prop, {
    cwd,
  }))

  if (!err && out) {
    ;({ code, out } = await dot.spawn(prop, {
      args: ["commit", "-a", "-m", message],
      command: "git",
      cwd,
    }))

    return { err: code > 0, out }
  }

  return { err, out }
}
