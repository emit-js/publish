module.exports = function(emit) {
  if (emit.publishWaitForAll) {
    return
  }

  emit.any("publishWaitForAll", publishWaitForAll)
}

function publishWaitForAll(arg, prop, emit) {
  return Promise.all([
    emit.wait("npmVersion"),
    emit.wait("emitVersion"),
    emit.wait("npmPublish"),
  ])
}
