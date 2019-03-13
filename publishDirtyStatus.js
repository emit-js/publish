module.exports = function(dot) {
  if (dot.publishDirtyStatus) {
    return
  }

  dot.any("publishDirtyStatus", publishDirtyStatus)
}

async function publishDirtyStatus(prop, arg, dot) {
  const { cwd } = arg
  const { code } = await dot.spawn(prop, {
    args: ["diff", "--exit-code"],
    command: "git",
    cwd,
    quiet: true,
  })
  return { err: false, out: code !== 0 }
}
