module.exports = function(dot) {
  if (dot.publish) {
    return
  }

  dot("dependencies", "publish", {
    arg: ["@dot-event/spawn"],
  })

  dot("alias", "publish", {
    v: ["version"],
  })

  dot.any("publish", publish)
}

async function publish(prop, arg, dot) {
  const { cwd, version } = arg
  const opts = { cli: true, cwd }

  if (await dirtyTree(prop, arg, dot)) {
    return
  }

  const { out } = await dot.spawn(prop, {
    args: ["describe"],
    command: "git",
    ...opts,
  })

  const released = out.match(/\.\d+\r\n$/)

  if (released) {
    return
  }

  const { code } = await dot.spawn(prop, {
    args: ["version", version || "patch"],
    command: "npm",
    ...opts,
  })

  if (code > 0) {
    return
  }

  await Promise.all([
    dot.spawn(prop, {
      args: ["push", "origin", "master"],
      command: "git",
      ...opts,
    }),
    dot.spawn(prop, {
      args: ["publish"],
      command: "npm",
      ...opts,
    }),
  ])
}

async function dirtyTree(prop, arg, dot) {
  const { code } = await dot.spawn(prop, {
    args: ["diff", "--exit-code"],
    command: "git",
    cwd: arg.cwd,
  })

  return code !== 0
}
