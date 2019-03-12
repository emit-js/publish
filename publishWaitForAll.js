module.exports = function(dot) {
  if (dot.publishWaitForAll) {
    return
  }

  dot.any("publishWaitForAll", publishWaitForAll)
}

function publishWaitForAll(dot) {
  return Promise.all([
    dot.wait("npmVersion"),
    dot.wait("dotVersion"),
  ])
}
