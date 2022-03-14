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
    socket.emit('receive-message', chatMessages.last10)

    // Connected room special private
    socket.join( userAuth.id)// ROOM_USER: global, socket.id, user.id


    // Clean when a user logs out
    socket.on('disconnect', ()=>{
        chatMessages.disconnectUser( userAuth.id );
        io.emit('active-users', chatMessages.usersArr);
    });

    socket.on('send-message', ({ uid, message})=>{
        if (uid){
            //Message private
            socket.to( uid ).emit('private-message',{de:userAuth.name, message});
        }else {
            //Message All users
            chatMessages.sendMessage(userAuth.id,userAuth.name,message);
            io.emit('receive-message', chatMessages.last10)
        }
    });
}

module.exports = {
    socketController
}
