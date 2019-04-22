export const LOGGED_IN_SUCCESS = 'LOGGED_IN_SUCCESS';

export const updateAccessToken = (accessToken = '') => ({type: LOGGED_IN_SUCCESS, payload: {accessToken}});
