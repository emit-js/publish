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

  await dot.publishWaitForAll()

  const { dirty } = await dot.publishGitCommit(prop, {
    cwd,
    message: "Dependency updates",
  })

  if (dirty) {
    await dot.publishNpmInstallCommit(prop, { cwd })
  }
}
