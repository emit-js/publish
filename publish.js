module.exports = function(dot) {
  if (dot.publish) {
    return
  }

  dot("dependencies", "publish", {
    arg: [
      "@dot-event/args",
      "@dot-event/glob",
      "@dot-event/spawn",
      "@dot-event/version",
      "@dot-event/wait",
    ],
  })

  dot("args", "publish", {
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

  dot("returns", "publish", { async: "array" })

  require("./publishCommitVersionChanges")(dot)
  require("./publishDirtyStatus")(dot)
  require("./publishGitCommit")(dot)
  require("./publishGitPush")(dot)
  require("./publishGitTag")(dot)
  require("./publishNpmInstallCommit")(dot)
  require("./publishNpmVersion")(dot)
  require("./publishProject")(dot)
  require("./publishReadBranch")(dot)
  require("./publishReadLastCommit")(dot)
  require("./publishReadVersion")(dot)
  require("./publishReleaseStatus")(dot)
  require("./publishWaitForAll")(dot)

  dot.any("publish", publish)
}

async function publish(prop, arg, dot) {
  const paths = await dot.glob(prop, {
    absolute: true,
    pattern: arg.paths,
  })

  return Promise.all(
    paths.map(async path => {
      if (arg.status) {
        return await dot.publishReleaseStatus(prop, {
          cli: true,
          cwd: path,
        })
      } else {
        return await dot.publishProject(prop, {
          ...arg,
          cwd: path,
          paths,
        })
      }
    })
  )
}
