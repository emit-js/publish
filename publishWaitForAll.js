module.exports = function(dot) {
  if (dot.publishWaitForAll) {
    return
  }

  dot.any("publishWaitForAll", publishWaitForAll)
}

function publishWaitForAll(prop, arg, dot) {
  return Promise.all([
    dot.wait("npmVersion"),
    dot.wait("dotVersion"),
    dot.wait("npmPublish"),
  ])
}
