import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {waitForElement, fireEvent} from '@testing-library/react';
import {adminProduct} from '../../reducer';
import auth from '../../../Auth/reducer';
import AddProduct from '../../components/Admin/AddProduct';
import NotificationBar from '../../../../components/NotificationBar';
import form from '../../../../reducers/form';
import notification from '../../../../reducers/notification';
import {inputKeys} from '../../config';

const mock = new MockAdapter(axios);
let store;

const dispatchEvt = (node, type, data) => {
    const event = new Event(type, { bubbles: true });
    Object.assign(event, data);
    fireEvent(node, event);
};

const mockData = files => ({
    dataTransfer: {
        files,
        items: files.map(file => ({
            kind: 'file',
            type: file.type,
            getAsFile: () => file
        })),
        types: ['Files']
    }
});

const productPayload = {
    active: true,
    stock: '1',
    images: [{
        avatar: '5d8fe72d9bb05c03d3b285d8.avatar.jpg?6409f645aab2319a61e4c2d804df484b',
        card: '5d8fe72d9bb05c03d3b285d8.card.jpg?92ae3f09916862bd086608c9a9aa0dfd',
        tile: '5d8fe72d9bb05c03d3b285d8.tile.jpg?10af0eb83db3314260504187215a9d9b',
    }],
    slug: 'optio-sint-eos-veritas',
    description: 'Perspiciatis qui ex',
    longDescription: 'Consequuntur nobis e',
    name: 'Cody Conway',
    unitPrice: '1700',
    weight: '150',
    createdAt: '2019-09-28T23:05:17.426Z',
    updatedAt: '2019-10-14T00:13:38.889Z',
    id: '5d8fe72d9bb05c03d3b285d8',
};

const setupFakeInputValues = (store, getByTestId) => {
    const testValues = ['foo', 'bar baz foo bar baz', 'baz bar foo baz bar', '2', '2000', '100', true, ''];
    inputKeys.forEach((key, idx) => {
        let requiredInput;
        if (key === 'img') {
            requiredInput = getByTestId('drop-zone-wrapper').querySelector('div');
            const file = new File([
                JSON.stringify({ping: true})
            ], 'ping.jpeg', { type: 'image/jpeg' });
            const data = mockData([file]);
            dispatchEvt(requiredInput, 'drop', data);
        } else {
            requiredInput = getByTestId(key).getElementsByTagName('input')[0] || getByTestId(key).getElementsByTagName('textarea')[0];
            fireEvent.change(requiredInput, {target: {value: testValues[idx]}});
        }
    });
};

describe('Admin/AddDeliveryMethod', () => {

    beforeEach(() => {
        mock.reset();
        store = createStore(
            combineReducers({
                adminProduct,
                auth,
                form,
                notification,
            }),
            applyMiddleware(thunk),
        );
    });

    it('should render add-product page', async () => {
        mock.onPost(/admin\/products/).replyOnce(() => {
            socket.socketClient.emit('adminCreateProduct', {product: productPayload, isActive: true});
            return [201, productPayload];
        });
        const {getByText, getByRole, getByTestId} = await renderWithStore(<><AddProduct/><NotificationBar/></>, store);
        expect(await waitForElement(() => getByText('Dodaj produkt'))).toBeDefined();
        expect(await waitForElement(() => getByText('Zapisz'))).toBeDefined();
        const saveBtn = await waitForElement(() => getByRole('button'));
        expect(saveBtn.disabled).toBe(true);
        setupFakeInputValues(store, getByTestId);
        expect((await waitForElement(() => getByRole('button'))).disabled).toBe(false);
        fireEvent.click(saveBtn);
        expect(await waitForElement(() => getByText(`Produkt ${productPayload.name} został dodany.`))).toBeDefined();
    });

    it('should show error message on network error', async () => {
        mock.onPost(/admin\/products/).networkErrorOnce();
        const {getByText, getByRole, getByTestId} = await renderWithStore(<><AddProduct/><NotificationBar/></>, store);
        const saveBtn = await waitForElement(() => getByRole('button'));
        setupFakeInputValues(store, getByTestId);
        expect((await waitForElement(() => getByRole('button'))).disabled).toBe(false);
        fireEvent.click(saveBtn);
        expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
    });

});