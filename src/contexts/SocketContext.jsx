import React, {useContext} from 'react';

const SocketContext = React.createContext(null);

export const useSocket = () => useContext(SocketContext);

export default SocketContext;
