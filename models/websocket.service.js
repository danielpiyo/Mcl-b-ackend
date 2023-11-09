// websocket.service.js (or .ts)

const nurseSockets = new Map();

function addNurseSocket(nurseId, socket) {
  nurseSockets.set(nurseId, socket);
}

function removeNurseSocket(nurseId) {
  nurseSockets.delete(nurseId);
}

function getNurseSocket(nurseId) {
  return nurseSockets.get(nurseId);
}

module.exports = {
  addNurseSocket,
  removeNurseSocket,
  getNurseSocket,
};
