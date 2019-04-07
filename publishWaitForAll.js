module.exports = function(emit) {
  if (emit.publishWaitForAll) {
    return
  }

  emit.any("publishWaitForAll", publishWaitForAll)
}

function publishWaitForAll(arg, prop, emit) {
  return Promise.all([
    emit.wait("npmVersion", null),
    emit.wait("emitVersion", null),
    emit.wait("npmPublish", null),
  ])
}
