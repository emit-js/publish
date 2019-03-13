module.exports = function(dot) {
  if (dot.publishGitTag) {
    return
  }

  dot.any("publishGitTag", publishGitTag)
}

async function publishGitTag(prop, arg, dot) {
  const { cwd, newVersion } = arg
  return await dot.spawn(prop, {
    args: ["tag", "-a", "-m", newVersion, newVersion],
    command: "git",
    cwd,
  })
}
