module.exports = function(dot) {
  if (dot.publishReadBranch) {
    return
  }

  dot.any("publishReadBranch", publishReadBranch)
}

async function publishReadBranch(prop, arg, dot) {
  const { cwd } = arg
  const { err, out } = await dot.spawn(prop, {
    args: ["rev-parse", "--abbrev-ref", "HEAD"],
    command: "git",
    cwd,
  })
  return { err, out: out.trim() }
}
