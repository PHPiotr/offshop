import io from 'socket.io-client';

let socket;

const getSocket = url => {
    if (socket) {
        return socket;
    }
    socket = io(url);

    return socket;
};

export default getSocket;
