module.exports = () => {
  const emit = require("@emit-js/emit")()

  require("@emit-js/glob")(emit)
  require("@emit-js/log")(emit)
  require("@emit-js/args")(emit)
  require("@emit-js/spawn")(emit)
  require("../")(emit)

  return emit
}
