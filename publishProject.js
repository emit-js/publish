module.exports = function(emit) {
  if (emit.publishProject) {
    return
  }

  emit.any("publishProject", publishProject)
}

async function publishProject(arg, prop, emit) {
  const { cwd, paths, version } = arg
  const count = paths.length

  var err, out
  ;({ err, out } = await emit.publishDirtyStatus(prop, {
    cwd,
  }))

  if (err || out) {
    return emit.publishWaitForAll()
  }

  ;({ err, out } = await emit.publishReadBranch(prop, {
    cwd,
  }))

  if (err || out !== "master") {
    return emit.publishWaitForAll()
  }

  ;({ err, out } = await emit.publishReleaseStatus(prop, {
    cwd,
  }))

  if (err || out) {
    return emit.publishCommitVersionChanges(prop, { cwd })
  }

  ;({ err } = await emit.publishNpmVersion(prop, {
    cwd,
    version,
  }))

  if (err) {
    return emit.publishWaitForAll()
  }

  await emit.wait("npmVersion", { count })

  if (!emit.state.versionRan) {
    emit.state.versionRan = true
    await emit.version(prop, { paths })
  }

  await emit.wait("emitVersion", { count })

  const newVersion = await emit.publishReadVersion(prop, {
    cwd,
  })

  ;({ err } = await emit.publishGitCommit(prop, {
    cwd,
    message: newVersion,
  }))

  if (err) {
    return emit.publishWaitForAll()
  }

  ;({ err } = await emit.publishGitTag(prop, {
    cwd,
    newVersion,
  }))

  if (err) {
    return emit.publishWaitForAll()
  }

  await Promise.all([
    emit.publishGitPush({ branch: newVersion, cwd }),
    emit.publishGitPush({ branch: "master", cwd }),
    emit.spawn(prop, {
      args: ["publish"],
      command: "npm",
      cwd,
      log: true,
    }),
  ])

  await emit.wait("npmPublish", { count })
  await emit.publishNpmInstallCommit({ cwd })
}
