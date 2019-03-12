module.exports = function(dot) {
  if (dot.publishDirtyStatus) {
    return
  }

  dot.any("publishDirtyStatus", publishDirtyStatus)
}

async function publishDirtyStatus(prop, arg, dot) {
  const { code } = await dot.spawn(prop, {
    args: ["diff", "--exit-code"],
    command: "git",
    cwd: arg.cwd,
  })
  return [false, code !== 0]
}
