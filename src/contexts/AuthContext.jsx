import React, {useContext} from 'react';

const AuthContext = React.createContext(null);

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
