const LOGGED_IN = 'LOGGED_IN';

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (e) {
        console.error(e);
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (e) {
        console.error(e);
    }
};

export const setLoggedInItem = (value) => {
    try {
        localStorage.setItem(LOGGED_IN, value);
    } catch (e) {
        console.error(e);
    }
};

export const getLoggedInItem = () => {
    try {
        return localStorage.getItem(LOGGED_IN);
    } catch (e) {
        console.log(e);
    }
};

export const removeLoggedInItem = () => {
    try {
        localStorage.removeItem(LOGGED_IN);
    } catch (e) {
        console.error(e);
    }
};
