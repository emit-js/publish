module.exports = function(dot) {
  if (dot.publishNpmInstallCommit) {
    return
  }

  dot.any(
    "publishNpmInstallCommit",
    publishNpmInstallCommit
  )
}

async function publishNpmInstallCommit(prop, arg, dot) {
  const { cwd } = arg

  const { err } = await dot.spawn(prop, {
    args: ["install"],
    command: "npm",
    cwd,
  })

  if (!err) {
    await dot.publishGitCommit(prop, {
      cwd,
      message: "package-lock.json",
    })
  }
}
