module.exports = function(dot) {
  if (dot.publishGitTag) {
    return
  }

  dot.any("publishGitTag", publishGitTag)
}

async function publishGitTag(prop, arg, dot) {
  const { cwd, newVersion } = arg
  const { code, out } = await dot.spawn(prop, {
    args: ["tag", "-a", "-m", newVersion, newVersion],
    command: "git",
    cwd,
  })
  return { err: code > 0, out }
}
