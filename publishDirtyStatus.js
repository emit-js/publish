module.exports = function(emit) {
  if (emit.publishDirtyStatus) {
    return
  }

  emit.any("publishDirtyStatus", publishDirtyStatus)
}

async function publishDirtyStatus(arg, prop, emit) {
  const { cwd } = arg
  const { code } = await emit.spawn(prop, {
    args: ["diff", "--exit-code"],
    command: "git",
    cwd,
    quiet: true,
  })
  return { err: false, out: code !== 0 }
}
