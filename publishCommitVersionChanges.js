module.exports = function(emit) {
  if (emit.publishCommitVersionChanges) {
    return
  }

  emit.any(
    "publishCommitVersionChanges",
    publishCommitVersionChanges
  )
}

async function publishCommitVersionChanges(
  arg,
  prop,
  emit
) {
  const { cwd } = arg

  await emit.publishWaitForAll()

  const { dirty } = await emit.publishGitCommit(prop, {
    cwd,
    message: "Dependency updates",
  })

  if (dirty) {
    await emit.publishNpmInstallCommit(prop, { cwd })
  }
}
