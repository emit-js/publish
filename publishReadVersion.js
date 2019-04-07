import { readJson } from "fs-extra"
import { join } from "path"

module.exports = function(emit) {
  if (emit.publishReadVersion) {
    return
  }

  emit.any("publishReadVersion", publishReadVersion)
}

async function publishReadVersion(arg) {
  const path = join(arg.cwd, "package.json")
  return (await readJson(path)).version
}
