module.exports = () => {
  const dot = require("dot-event")()

  require("@dot-event/glob")(dot)
  require("@dot-event/log")(dot)
  require("@dot-event/args")(dot)
  require("@dot-event/spawn")(dot)
  require("../")(dot)

  return dot
}
