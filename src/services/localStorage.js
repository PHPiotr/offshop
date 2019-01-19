export const setItem = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.error(e);
    }
};

export const getItem = (key) => {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        // @TODO: Log error
        return null;
    }
};

export const removeItem = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error(e);
    }
};

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (err) {
        // @TODO: Log error
    }
};
