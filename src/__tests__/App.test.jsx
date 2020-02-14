import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {waitForElement, fireEvent} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from '../App';
import reducers from '../reducers';
import {UPDATE_AUTH} from '../modules/Auth/actionTypes';
import configureStore from '../store';
import Auth from '../services/auth';

const mock = new MockAdapter(axios);
let store;

const ordersPayload = [
    {
        extOrderId: '5e15a4d08f62305337b7c8a6',
        orderCreateDate: '2020-01-08T09:45:52.015Z',
        status: 'PENDING',
        totalAmount: '99073',
        id: '5e15a4d08f62305337b7c8a7',
    },
    {
        extOrderId: '5e149a958f62305337b7c8a4',
        orderCreateDate: '2020-01-07T14:49:57.734Z',
        status: 'COMPLETED',
        totalAmount: '45100',
        id: '5e149a958f62305337b7c8a5',
        refund: {
            status: 'fizz',
        },
    },
];

const productsPayload = [
    {
        active: true,
        stock: '24',
        images: [
            {
                avatar: '5da5c9624f651730df445459.avatar.jpg?42639d03824bb02c32939f7ce9a7c2e3',
                card: '5da5c9624f651730df445459.card.jpg?7e42d30ed0a97b7aefb8a96294aed314',
                tile: '5da5c9624f651730df445459.tile.jpg?96010ab5e06f34fb358ad3e154fee610',
            }
        ],
        description: 'Et dolore amet pers',
        longDescription: 'Molestias accusamus',
        name: 'Abdul Br',
        unitPrice: '43200',
        weight: '5300',
        slug: 'abdul-br',
        createdAt: '2019-10-15T13:28:02.928Z',
        updatedAt: '2020-01-24T13:41:53.218Z',
        id: '5da5c9624f651730df445459',
    }
];

describe('App', () => {

    beforeEach(() => {
        mock.reset();
        store = createStore(
            reducers,
            applyMiddleware(thunk),
        );
    });

    describe('Store', () => {

        test.each([
            ['1', configureStore(localStorage, true, module.hot)],
            ['2', configureStore(localStorage, false, module.hot)],
            ['3', configureStore(localStorage, true, {accept: (foo, callback) => callback()})],
            ['4', configureStore(localStorage, false, {accept: (foo, callback) => callback()})],
            ['5', configureStore({
                getItem: () => {throw new Error('Foo')},
                setItem: () => {throw new Error('Bar')},
            }, true, null)],
            ['6', configureStore({
                getItem: () => {throw new Error('Foo')},
                setItem: () => {throw new Error('Bar')},
            }, false, null)],
        ])('works with store %s', async (_, store) => {
            await renderWithStore(<App/>, store);
        });

    });

    describe('Auth context', () => {

        beforeEach(() => {
            mock.onGet(/products/).reply(200, productsPayload);
        });

        let expected;

        test.each([
            ['1', new Auth({
                parseHash: cb => {
                    expected = '1';
                    cb(null, {accessToken: 'foo.bar.baz', idToken: 'fizz.buzz', expiresIn: 3600});
                },
                checkSession: () => {},
                authorize: () => {},
            }), '/callback#access_token=foo.bar.baz'],
            ['2', new Auth({
                parseHash: cb => {
                    expected = '2';
                    cb(null, {});
                },
                checkSession: () => {},
                authorize: () => {},
            }), '/callback#access_token=foo.bar.baz'],
            ['3', new Auth({
                parseHash: cb => {
                    cb(null, {accessToken: 'foo.bar.baz', idToken: 'fizz.buzz', expiresIn: 3600});
                },
                checkSession: (_, cb) => {
                    expected = '3';
                    cb(null, {accessToken: 'foo.bar.baz', idToken: 'fizz.buzz', expiresIn: 3600});
                },
                authorize: () => {},
            }), '/admin/products/list'],
            ['4', new Auth({
                parseHash: cb => {
                    cb(null, {accessToken: 'foo.bar.baz', idToken: 'fizz.buzz', expiresIn: 3600});
                },
                checkSession: async (_, cb) => {
                    expected = '4';
                    cb(new Error('Foo'), null);
                },
                authorize: () => {},
            }), '/admin/products/list'],
        ])('works with auth %s', async (actual, auth, route) => {
            await renderWithAuth(<App/>, store, auth, {route});
            expect(expected).toEqual(actual);
        });
    });

    it('should render the app', async () => {
        mock.onGet(/.*/).replyOnce(200, productsPayload);
        const {getByText} = await renderWithRouter(<App/>, store);
        expect(await waitForElement(() => getByText(productsPayload[0].name))).toBeDefined();
    });

    it('should render not found', async () => {
        const {getByText} = await renderWithRouter(<App/>, store, {
            route: '/something-that-does-not-match',
        });
        expect(await waitForElement(() => getByText('Request failed with status code 404'))).toBeDefined();
    });

    describe('PrivateRoute', () => {

        it('should render private route component', async () => {
            class FakeAuth {
                isAuthenticated() {
                    return true;
                }
                renewSession() {
                    Promise.resolve();
                }
            };
            mock.onGet(/.*/).replyOnce(200, productsPayload);
            const {getByText} = await renderWithAuth(<App/>, store, new FakeAuth(), {
                route: '/admin/products/list',
            });
            expect(await waitForElement(() => getByText(productsPayload[0].name))).toBeDefined();
        });

        it('should not render private route component if not authenticated', async () => {
            class FakeAuth {
                isAuthenticated() {
                    return false;
                }
                renewSession() {
                    Promise.resolve();
                }
                login() {
                    return null;
                }
            };
            mock.onGet(/.*/).replyOnce(200, productsPayload);
            const {queryByText} = await renderWithAuth(<App/>, store, new FakeAuth(), {
                route: '/admin/products/list',
            });
            expect(queryByText(productsPayload[0].name)).toBeNull();
        });

        it('should redirect back if logged in and trying to log in again', async () => {
            class FakeAuth {
                isAuthenticated() {
                    return true;
                }
                renewSession() {
                    Promise.resolve();
                }
            };
            mock.onGet(/.*/).reply(200, productsPayload);
            store.dispatch({type: UPDATE_AUTH, payload: {
                accessToken: 'j.w.t',
                idToken: 'foo.bar.baz',
                expiresAt: new Date().getTime() + 3600,
            }});
            const {getByText} = await renderWithAuth(<App/>, store, new FakeAuth(), {
                route: '/admin/products/list',
            });
            await renderWithAuth(<App/>, store, new FakeAuth(), {
                route: '/login',
            });

           expect(await waitForElement(() => getByText(productsPayload[0].name))).toBeDefined();
        });

    });

    it('should be able to toggle drawer visibility', async () => {
        store.dispatch({type: UPDATE_AUTH, payload: {
            accessToken: 'j.w.t',
            idToken: 'foo.bar.baz',
            expiresAt: new Date().getTime() + 3600,
            }});
        const {getByLabelText, getByText, queryByText} = await renderWithRouter(<App/>, {...store});
        const openDrawer = await waitForElement(() => getByLabelText('Open drawer'));
        expect(queryByText('Admin')).toBeNull();
        fireEvent.click(openDrawer);
        expect(getByText('Admin')).toBeDefined();
        const closeDrawer = getByLabelText('Close drawer');
        fireEvent.click(closeDrawer);
        expect(queryByText('Admin')).toBeNull();
    });

    it('should redirect back if trying access callback handler', async () => {
        mock.onGet(/.*/).replyOnce(200, productsPayload);
        class FakeAuth {
            isAuthenticated() {
                return true;
            }
            renewSession() {
                Promise.resolve();
            }
        };
        const {getByText} = await renderWithAuth(<App/>, store, new FakeAuth(), {
            route: '/admin/products/list',
        });
        await renderWithAuth(<App/>, store, new FakeAuth(), {
            route: '/callback',
        });
        expect(await waitForElement(() => getByText(productsPayload[0].name))).toBeDefined();
    });

    it('should redirect to admin orders page if callback handler contains access token', async () => {
        mock.onGet(/.*/).replyOnce(200, ordersPayload);
        class FakeAuth {
            isAuthenticated() {
                return true;
            }
            renewSession() {
                Promise.resolve();
            }
            handleAuthentication() {
                Promise.resolve();
            }
            getAccessToken() {
                return 'f.o.o'
            }
            getIdToken() {
                return 'b.a.r'
            }
            getExpiresAt() {
                return (new Date()).getTime() + 3600;
            }
        };
        const {getByText} = await renderWithAuth(<App/>, store, new FakeAuth(), {
            route: '/callback#access_token=f.o.o',
        });
        expect(await waitForElement(() => getByText(ordersPayload[0].extOrderId))).toBeDefined();
    });

    it('should call auth logout on callback error', async () => {
        mock.onGet(/.*/).replyOnce(200, ordersPayload);
        class FakeAuth {
            access_token = 'fizz';
            isAuthenticated() {
                return true;
            }
            renewSession() {
                Promise.resolve();
            }
            handleAuthentication() {
                Promise.resolve();
            }
            getAccessToken() {
                throw new Error('Foo');
            }
            login() {
                Promise.resolve();
            }
            logout() {
                this.access_token = 'buzz';
            }
        };
        const fakeAuth = new FakeAuth();
        expect(fakeAuth.access_token).toEqual('fizz');
        await renderWithAuth(<App/>, store, fakeAuth, {
            route: '/callback#access_token=f.o.o',
        });
        expect(fakeAuth.access_token).toEqual('buzz');
    });

    it('should logout and redirect to home age on logout route', async () => {
        mock.onGet(/.*/).replyOnce(200, productsPayload);
        class FakeAuth {
            isAuthenticated() {
                return true;
            }
            renewSession() {
                Promise.resolve();
            }
            logout() {}
        };
        const fakeAuth = new FakeAuth();
        const {getByText} = await renderWithAuth(<App/>, store, fakeAuth, {
            route: '/logout',
        });
        expect(await waitForElement(() => getByText(productsPayload[0].name))).toBeDefined();
    });

    it('should redirect to home page if trying to access checkout and no products in cart', async () => {
        mock.onGet(/.*/).reply(200, productsPayload);
        const {getByText} = await renderWithRouter(<App/>, store, {
            route: '/checkout',
        });
        expect(await waitForElement(() => getByText(productsPayload[0].name))).toBeDefined();
    });

});
