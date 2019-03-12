module.exports = function(dot) {
  if (dot.publishCommitVersionChanges) {
    return
  }

  dot.any(
    "publishCommitVersionChanges",
    publishCommitVersionChanges
  )
}

async function publishCommitVersionChanges(prop, arg, dot) {
  const { cwd } = arg
  await dot.publishWaitForAll(dot)
  await dot.publishGitCommit(prop, {
    cwd,
    message: "Dependency updates",
  })
}
