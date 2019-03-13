const args = {
  v: ["version"],
}

const dependencies = [
  "@dot-event/spawn",
  "@dot-event/version",
  "@dot-event/wait",
]

const describe = `
  A project is ready for release if it:

    — has a clean git tree
    — is on master
    — is untagged (unreleased)

  If a project is ready for release:

    — bump the npm version, defaults to --version=patch
    — sync all versions using @dot-event/version
    — git commit, tag, push
    — npm publish

  If the project has a clean git tree and is on master, but
  tagged (released):

    — wait for version sync
    — git commit if dependencies changed

  After all of the above steps finish:
  
    — npm install
    — git commit package-lock.json
`

module.exports = function(dot) {
  if (dot.publish) {
    return
  }

  dot("alias", "publish", args)
  dot("describe", "publish", { arg: describe })
  dot("dependencies", "publish", { arg: dependencies })

  dot.any("publish", publish)

  require("./publishCommitVersionChanges")(dot)
  require("./publishDirtyStatus")(dot)
  require("./publishGitCommit")(dot)
  require("./publishGitPush")(dot)
  require("./publishGitTag")(dot)
  require("./publishNpmVersion")(dot)
  require("./publishReadBranch")(dot)
  require("./publishReadLastCommit")(dot)
  require("./publishReadVersion")(dot)
  require("./publishReleaseStatus")(dot)
  require("./publishWaitForAll")(dot)
}

async function publish(prop, arg, dot) {
  const { cwd, paths, version } = arg
  const count = paths.length

  var err, out
  ;({ err, out } = await dot.publishDirtyStatus(prop, {
    cwd,
  }))

  if (err || out) {
    return dot.publishWaitForAll()
  }

  ;({ err, out } = await dot.publishReadBranch(prop, {
    cwd,
  }))

  if (err || out !== "master") {
    return dot.publishWaitForAll()
  }

  ;({ err, out } = await dot.publishReleaseStatus(prop, {
    cwd,
  }))

  if (err || out) {
    return dot.publishCommitVersionChanges(prop, { cwd })
  }

  ;({ err } = await dot.publishNpmVersion(prop, {
    cwd,
    version,
  }))

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

  ;({ err } = await dot.publishGitCommit(prop, {
    cwd,
    message: newVersion,
  }))

  if (err) {
    return dot.publishWaitForAll()
  }

  ;({ err } = await dot.publishGitTag(prop, {
    cwd,
    newVersion,
  }))

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
