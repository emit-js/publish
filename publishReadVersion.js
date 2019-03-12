import { readJson } from "fs-extra"
import { join } from "path"

module.exports = function(dot) {
  if (dot.publishReadVersion) {
    return
  }

  dot.any("publishReadVersion", publishReadVersion)
}

async function publishReadVersion(prop, arg) {
  const path = join(arg.cwd, "package.json")
  return (await readJson(path)).version
}
