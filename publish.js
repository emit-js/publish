const describe = `
If a project:

* has a clean git tree
* is on master
* is untagged (unreleased)

then:

* bump the npm version (default semver: --version=patch)
* sync all versions using @dot-event/version
* git commit, tag, push
* npm publish

Otherwise, if the project has a clean git tree and is on
master, but is tagged (released):

* wait for version sync
* git commit if dependencies changed
`

module.exports = function(dot) {
  if (dot.publish) {
    return
  }

  dot("describe", "publish", { arg: describe })

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

  require("./publishCommitVersionChanges")(dot)
  require("./publishDirtyStatus")(dot)
  require("./publishGitCommit")(dot)
  require("./publishGitPush")(dot)
  require("./publishGitTag")(dot)
  require("./publishNpmVersion")(dot)
  require("./publishReadBranch")(dot)
  require("./publishReadVersion")(dot)
  require("./publishReleaseStatus")(dot)
  require("./publishWaitForAll")(dot)
}

async function publish(prop, arg, dot) {
  const { cwd, paths, version } = arg
  const count = paths.length

  var err, out
  ;[err, out] = await dot.publishDirtyStatus(prop, { cwd })

  if (err || out) {
    return dot.publishWaitForAll()
  }

  ;[err, out] = await dot.publishReadBranch(prop, { cwd })

  if (err || out !== "master") {
    return dot.publishWaitForAll()
  }

  ;[err, out] = await dot.publishReleaseStatus(prop, {
    cwd,
  })

  if (err || out) {
    return dot.publishCommitVersionChanges(prop, { cwd })
  }

  ;[err, out] = await dot.publishNpmVersion(prop, {
    cwd,
    version,
  })

  if (err) {
    return dot.publishWaitForAll()
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

  const newVersion = await dot.publishReadVersion(prop, {
    cwd,
  })

  ;[err, out] = await dot.publishGitCommit(prop, {
    cwd,
    message: newVersion,
  })

  if (err) {
    return dot.publishWaitForAll()
  }

  ;[err, out] = await dot.publishGitTag(prop, {
    cwd,
    newVersion,
  })

  if (err) {
    return dot.publishWaitForAll()
  }

  await Promise.all([
    dot.publishGitPush({ branch: newVersion, cwd }),
    dot.publishGitPush({ branch: "master", cwd }),
    dot.spawn(prop, {
      args: ["publish"],
      command: "npm",
      cwd,
      log: true,
    }),
  ])
}
