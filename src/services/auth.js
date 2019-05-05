import Auth0 from 'auth0-js';

const auth0 = new Auth0.WebAuth({
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    responseType: process.env.REACT_APP_AUTH0_RESPONSE_TYPE,
    scope: process.env.REACT_APP_AUTH0_SCOPE,
});

export default class Auth {

    accessToken;
    idToken;
    expiresAt;

    constructor() {
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
        this.getIdToken = this.getIdToken.bind(this);
        this.renewSession = this.renewSession.bind(this);
    }

    handleAuthentication() {
        return new Promise((resolve, reject) => {
            auth0.parseHash((err, authResult) => {
                if (authResult && authResult.accessToken && authResult.idToken) {
                    this.setSession(authResult);
                    resolve();
                } else {
                    reject(err);
                }
            });
        });
    }

    renewSession() {
        return new Promise((resolve, reject) => {
            auth0.checkSession({}, (err, authResult) => {
                if (authResult && authResult.accessToken && authResult.idToken) {
                    this.setSession(authResult);
                    resolve();
                } else {
                    this.logout();
                    reject(err);
                }
            });
        });
    }

    getAccessToken() {
        return this.accessToken;
    }

    getIdToken() {
        return this.idToken;
    }

    getExpiresAt() {
        return this.expiresAt;
    }

    setSession(authResult) {
        let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
        this.accessToken = authResult.accessToken;
        this.idToken = authResult.idToken;
        this.expiresAt = expiresAt;
    }

    login() {
        auth0.authorize();
    }

    logout() {
        this.accessToken = null;
        this.idToken = null;
        this.expiresAt = 0;
    }

    isAuthenticated() {
        return new Date().getTime() < this.expiresAt;
    }
}
