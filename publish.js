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

  require("./publishDirtyStatus")(dot)
  require("./publishGitCommit")(dot)
  require("./publishGitPush")(dot)
  require("./publishGitTag")(dot)
  require("./publishNpmVersion")(dot)
  require("./publishReadBranch")(dot)
  require("./publishReadVersion")(dot)
  require("./publishReleaseStatus")(dot)

  dot.any("publish", publish)
}

async function publish(prop, arg, dot) {
  const { cwd, paths } = arg
  const count = paths.length

  var err, out
  ;[err, out] = await dot.publishDirtyStatus(prop, arg, dot)

  if (err || out) {
    return cancelWait(dot)
  }

  ;[err, out] = await dot.publishReadBranch(prop, arg, dot)

  if (err || out !== "master") {
    return cancelWait(dot)
  }

  ;[err, out] = await dot.publishReleaseStatus(
    prop,
    arg,
    dot
  )

  if (err || out) {
    return cancelWait(dot)
  }

  ;[err, out] = await dot.publishNpmVersion(prop, arg, dot)

  if (err) {
    return cancelWait(dot)
  }

  await dot.wait("npmVersion", { count })

  if (!dot.state.versionRan) {
    dot.state.versionRan = true

    await dot.cliEmit(prop, {
      argv: {
        eventId: "version",
      },
      paths,
    })
  }

  await dot.wait("dotVersion", { count })

  const newVersion = await dot.publishReadVersion(prop, arg)
  const newArg = { cwd, newVersion }

  ;[err, out] = await dot.publishGitCommit(
    prop,
    newArg,
    dot
  )

  if (err) {
    return cancelWait(dot)
  }

  ;[err, out] = await dot.publishGitTag(prop, newArg, dot)

  if (err) {
    return cancelWait(dot)
  }

  await Promise.all([
    dot.publishGitPush({ branch: newVersion, cwd }),
    dot.publishGitPush({ branch: "master", cwd }),
    dot.spawn(prop, {
      args: ["publish"],
      command: "npm",
      cwd,
    }),
  ])
}

function cancelWait(dot) {
  return Promise.all([
    dot.wait("npmVersion"),
    dot.wait("dotVersion"),
  ])
}
