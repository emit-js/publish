module.exports = function(dot) {
  if (dot.publish) {
    return
  }

  dot("dependencies", "publish", {
    arg: [
      "@dot-event/spawn",
      "@dot-event/version",
      "@dot-event/wait",
    ],
  })

  dot("alias", "publish", {
    v: ["version"],
  })

  dot.any("publish", publish)
}

async function publish(prop, arg, dot) {
  const { cwd, paths, version } = arg
  const count = paths.length,
    opts = { cli: true, cwd }

  if (await dirtyTree(prop, arg, dot)) {
    return returnWait(prop, count, dot)
  }

  const { out } = await dot.spawn(prop, {
    args: ["describe"],
    command: "git",
    ...opts,
  })

  const released = out.match(/\.\d+\r\n$/)

  if (released) {
    return returnWait(prop, count, dot)
  }

  const { code } = await dot.spawn(prop, {
    args: ["version", version || "patch"],
    command: "npm",
    ...opts,
  })

  await dot.wait("waitForPatches", { count })

  if (code > 0) {
    return returnWait(prop, count, dot)
  }

  if (!arg.versionRan) {
    arg.versionRan = true
    await dot.cliEmit(prop, {
      argv: {
        eventId: "version",
      },
      paths,
    })
  }

  await dot.wait("waitForVersion", { count })

  await dot.spawn(prop, {
    args: ["commit", "-a", "--amend", "--no-edit"],
    command: "git",
    ...opts,
  })

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

function returnWait(prop, arg, dot) {
  return Promise.all([
    dot.wait("waitForPatches", { count: arg }),
    dot.wait("waitForVersion", { count: arg }),
  ])
}
