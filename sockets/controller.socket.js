const { Socket } = require('socket.io');
const { checkJWT } = require('../helpers');
const { ChatMessages } = require('../models');

const chatMessages = new ChatMessages();

const socketController = async (socket = new Socket(), io ) => {

    const userAuth = await checkJWT(socket.handshake.headers['x-token']);
    if (!userAuth) {
        return socket.disconnect();
    }

    // Add the logged in user
    chatMessages.connectUser( userAuth );
    io.emit('active-users', chatMessages.usersArr )

    // Clean when a user logs out
    socket.on('disconnect', ()=>{
        chatMessages.disconnectUser( userAuth.id );
        io.emit('active-users', chatMessages.usersArr);
    });
}

module.exports = {
    socketController
}
