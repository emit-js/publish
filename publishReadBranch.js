module.exports = function(emit) {
  if (emit.publishReadBranch) {
    return
  }

  emit.any("publishReadBranch", publishReadBranch)
}

async function publishReadBranch(arg, prop, emit) {
  const { cwd } = arg
  const { err, out } = await emit.spawn(prop, {
    args: ["rev-parse", "--abbrev-ref", "HEAD"],
    command: "git",
    cwd,
  })
  return { err, out: out.trim() }
}
