module.exports = function(emit) {
  if (emit.publish) {
    return
  }

  emit("dependencies", "publish", [
    "@emit-js/args",
    "@emit-js/glob",
    "@emit-js/spawn",
    "@emit-js/version",
    "@emit-js/wait",
  ])

  emit("args", "publish", {
    paths: {
      alias: ["_", "p"],
      default: [],
    },
    status: {
      alias: ["s"],
    },
    version: {
      alias: "v",
      default: "patch",
    },
  })

  emit("returns", "publish", { async: "array" })

  require("./publishCommitVersionChanges")(emit)
  require("./publishDirtyStatus")(emit)
  require("./publishGitCommit")(emit)
  require("./publishGitPush")(emit)
  require("./publishGitTag")(emit)
  require("./publishNpmInstallCommit")(emit)
  require("./publishNpmVersion")(emit)
  require("./publishProject")(emit)
  require("./publishReadBranch")(emit)
  require("./publishReadLastCommit")(emit)
  require("./publishReadVersion")(emit)
  require("./publishReleaseStatus")(emit)
  require("./publishWaitForAll")(emit)

  emit.any("publish", publish)
}

async function publish(arg, prop, emit) {
  const paths = await emit.glob(prop, {
    absolute: true,
    pattern: arg.paths,
  })

  return Promise.all(
    paths.map(async path => {
      if (arg.status) {
        return await emit.publishReleaseStatus(prop, {
          cli: true,
          cwd: path,
        })
      } else {
        return await emit.publishProject(prop, {
          ...arg,
          cwd: path,
          paths,
        })
      }
    })
  )
}
