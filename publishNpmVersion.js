module.exports = function(dot) {
  if (dot.publishNpmVersion) {
    return
  }

  dot.any("publishNpmVersion", publishNpmVersion)
}

async function publishNpmVersion(prop, arg, dot) {
  const { cwd, version } = arg
  return await dot.spawn(prop, {
    args: [
      "version",
      version || "patch",
      "--no-git-tag-version",
    ],
    command: "npm",
    cwd,
  })
}
