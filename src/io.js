import io from 'socket.io-client';

let socket;

const getSocket = () => {
    if (socket) {
        return socket;
    }
    socket = io(process.env.REACT_APP_API_HOST);

    return socket;
};

export default getSocket;
