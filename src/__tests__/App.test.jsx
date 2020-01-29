import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {waitForElement, fireEvent} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from '../App';
import reducers from '../reducers';
import {UPDATE_AUTH} from '../modules/Auth/actionTypes';

const mock = new MockAdapter(axios);
let store;

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
        fakeLocalStorage();
        mock.reset();
        store = createStore(
            reducers,
            applyMiddleware(thunk),
        );
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

});
