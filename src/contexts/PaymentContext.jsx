import React, {useContext} from 'react';

const PaymentContext = React.createContext(null);

export const usePayment = () => useContext(PaymentContext);

export default PaymentContext;
