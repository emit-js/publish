module.exports = function(emit) {
  if (emit.publishNpmInstallCommit) {
    return
  }

  emit.any(
    "publishNpmInstallCommit",
    publishNpmInstallCommit
  )
}

async function publishNpmInstallCommit(arg, prop, emit) {
  const { cwd } = arg

  const { err } = await emit.spawn(prop, {
    args: ["install"],
    command: "npm",
    cwd,
  })

  if (!err) {
    await emit.publishGitCommit(prop, {
      cwd,
      message: "package-lock.json",
    })
  }
}
