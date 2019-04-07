module.exports = function(emit) {
  if (emit.publishNpmVersion) {
    return
  }

  emit.any("publishNpmVersion", publishNpmVersion)
}

async function publishNpmVersion(arg, prop, emit) {
  const { cwd, version } = arg
  return await emit.spawn(prop, {
    args: [
      "version",
      version || "patch",
      "--no-git-tag-version",
    ],
    command: "npm",
    cwd,
  })
}
