import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {waitForElement, fireEvent} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ProductsList from '../../components/Admin/ProductsList';
import auth from '../../../Auth/reducer';
import notification from '../../../../reducers/notification';
import {adminProducts} from '../../reducer';
import NotificationBar from '../../../../components/NotificationBar';

const mock = new MockAdapter(axios);
let store;

const adminProductsPayload = [
    {
        active: true,
        stock: '24',
        images: [{
            avatar: '5da5c9624f651730df445459.avatar.jpg?42639d03824bb02c32939f7ce9a7c2e3',
            card: '5da5c9624f651730df445459.card.jpg?7e42d30ed0a97b7aefb8a96294aed314',
            tile: '5da5c9624f651730df445459.tile.jpg?96010ab5e06f34fb358ad3e154fee610',
        }],
        description: 'Et dolore amet pers',
        longDescription: 'Molestias accusamus',
        name: 'Abdul Br',
        unitPrice: '43200',
        weight: '5300',
        slug: 'abdul-br',
        createdAt: '2019-10-15T13:28:02.928Z',
        updatedAt: '2020-01-24T13:41:53.218Z',
        id: '5da5c9624f651730df445459',
    },
    {
        active: false,
        stock: '7',
        images: [{
            avatar: '5dab14553b23fc2f9750862b.avatar.jpg?70aa610d5ef63944b0aa38b93e2a4563',
            card: '5dab14553b23fc2f9750862b.card.jpg?d834a674a81e8f3d61d7306d6b2fb364',
            tile: '5dab14553b23fc2f9750862b.tile.jpg?a05ce5adaa0db0cc77ddb0532a534abb',
        }],
        description: 'Excepteur sunt enim',
        longDescription: 'Elit ut aut aut aut',
        name: 'Aretha Simmy',
        unitPrice: '4298',
        weight: '190',
        slug: 'aretha-simmy',
        createdAt: '2019-10-19T13:49:09.426Z',
        updatedAt: '2020-01-19T00:55:05.973Z',
        id: '5dab14553b23fc2f9750862b',
    },
];

describe('Admin/ProductsList', () => {

    beforeEach(() => {
        mock.reset();
        store = createStore(
            combineReducers({adminProducts, auth, notification}),
            applyMiddleware(thunk),
        );
    });

    it('should merge existing results with new one on scroll to bottom', async () => {
        mock.onGet(/admin\/products/).replyOnce(200, adminProductsPayload);
        class FakeAuth {
            isAuthenticated() {
                return true;
            }
            renewSession() {
                Promise.resolve();
            }
        };
        const {getByText} = await renderWithAuth(<ProductsList match={{params: {limit: 1}}}/>, store, new FakeAuth(), {
            route: '/admin/products?limit=1',
        });
        await Promise.all([
            waitForElement(() => getByText(adminProductsPayload[0].name)),
            waitForElement(() => getByText(adminProductsPayload[1].name)),
        ]);
        mock.onGet(/admin\/products/).replyOnce(200, [{
            active: true,
            stock: '122',
            images: [{
                avatar: '6da5c9624f651730df445459.avatar.jpg?42639d03824bb02c32939f7ce9a7c2e3',
                card: '6da5c9624f651730df445459.card.jpg?7e42d30ed0a97b7aefb8a96294aed314',
                tile: '6da5c9624f651730df445459.tile.jpg?96010ab5e06f34fb358ad3e154fee610',
            }],
            description: 'Hello et dolore amet pers',
            longDescription: 'World molestias accusamus',
            name: 'Abigail Brown',
            unitPrice: '53200',
            weight: '4300',
            slug: 'abigail-brown',
            createdAt: '2019-11-15T13:28:02.928Z',
            updatedAt: '2020-02-01T13:41:53.218Z',
            id: '6da5c9624f651730df445459',
        }]);
        fireEvent.scroll(window, {
            target: {
                scrollY: 1000,
            }
        });
        await Promise.all([
            waitForElement(() => getByText(adminProductsPayload[0].name)),
            waitForElement(() => getByText(adminProductsPayload[1].name)),
            waitForElement(() => getByText('Abigail Brown')),
        ]);
    });

    it('should delete product', async () => {
        mock.onGet(/admin\/products/).replyOnce(200, adminProductsPayload);
        mock.onDelete(/admin\/products/).replyOnce(() => {
            socket.socketClient.emit('adminDeleteProduct', {product: adminProductsPayload[0], wasActive: adminProductsPayload[0].active});
            return [204];
        });
        const testedProductName = adminProductsPayload[0].name;
        const {getByLabelText, getByText, queryByText} = await renderWithStore(<ProductsList/>, store);
        expect(await waitForElement(() => getByText(testedProductName))).toBeDefined();
        const deleteBtn = await waitForElement(() => getByLabelText(`Delete product ${adminProductsPayload[0].id}`));
        fireEvent.click(deleteBtn);
        const yes = getByText('Tak');
        const no = getByText('Nie');
        fireEvent.click(no);
        expect(queryByText(testedProductName)).toBeDefined();
        fireEvent.click(deleteBtn);
        fireEvent.click(yes);
        expect(queryByText(testedProductName)).toBeNull();
    });

    it('should render error page on list products failure', async () => {
        mock.onGet(/admin\/products/).networkErrorOnce();
        const {getByText} = await renderWithStore(<ProductsList/>, store);
        expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
    });

    it('should display error notification on delete product failure', async () => {
        mock.onGet(/admin\/products/).replyOnce(200, adminProductsPayload);
        mock.onDelete(/admin\/products/).networkErrorOnce();
        const {getByLabelText, getByText} = await renderWithStore(<><ProductsList/><NotificationBar/></>, store);
        fireEvent.click(await waitForElement(() => getByLabelText(`Delete product ${adminProductsPayload[0].id}`)));
        fireEvent.click(getByText('Tak'));
        expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
    });

});
