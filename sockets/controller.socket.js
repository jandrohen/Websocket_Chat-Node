const { Socket } = require('socket.io');
const { checkJWT } = require('../helpers');

const socketController = async (socket = new Socket() ) => {

    const userAuth = await checkJWT(socket.handshake.headers['x-token']);
    if (!userAuth) {
        return socket.disconnect();
    }
    console.log('se conecto', userAuth.name)
}

module.exports = {
    socketController
}
