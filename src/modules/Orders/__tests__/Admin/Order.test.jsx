import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {waitForElement, fireEvent} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {adminOrder} from '../../reducer';
import auth from '../../../../modules/Auth/reducer';
import dialog from '../../../../reducers/dialog';
import notification from '../../../../reducers/notification';
import Order from '../../components/Admin/Order';
import NotificationBar from '../../../../components/NotificationBar';

const mock = new MockAdapter(axios);
let store;

const authorizePayload = {
    access_token: 'foo',
    token_type: 'bearer',
    expires_in: 3600,
    grant_type: 'client_credentials',
};

const orderPayload = {
    extOrderId: '5e149a3e8f62305337b7c8a2',
    localReceiptDateTime: '2020-01-07T14:48:30.113Z',
    orderCreateDate: '2020-01-07T14:48:30.113Z',
    status: 'PENDING',
    totalAmount: '90200',
    totalWithoutDelivery: '87312',
    id: '5e149a3e8f62305337b7c8a3',
    description: 'foo',
    currencyCode: 'PLN',
    totalWeight: '200',
    properties: [
        {
            name: 'foo',
            value: 'bar',
        }
    ],
    refund: {
        refundId: 'refundId',
        extRefundId: 'extRefundId',
        status: 'bar',
        amount: '90200',
        refundDate: '2019-10-10T21:23:01.106Z',
        description: 'baz',
        reason: 'fizz',
        reasonDescription: 'buzz',
        currencyCode: 'PLN',
    },
    products: [
        {
            id: '5da476864f651730df445456',
            name: 'Aaron Reese',
            slug: 'aaron-reese',
            unitPrice: '45100',
            quantity: 2,
        }
    ],
    productsIds: ['5da476864f651730df445456'],
    buyer: {
        email: 'piet.kowalski@gmail.com',
        phone: '07417416889',
        firstName: 'Piotr',
        lastName: 'Kowalski',
        language: 'pl',
        delivery: {
            street: 'foo-street',
            postalCode: 'bar',
            city: 'baz',
            recipientName: 'fizz',
            countryCode: 'PL',
        },
    },
    deliveryMethod: {
        active: true,
        name: 'Kurier',
        unitPrice: '1999',
        createdAt: '2019-03-05T01:01:30.486Z',
        updatedAt: '2019-10-10T21:23:01.106Z',
        slug: 'kurier',
        id: '5c7dca6a0c37236da9232f9d',
    },
};

describe('Admin/Order', () => {

    beforeEach(() => {
        mock.reset();
        store = createStore(
            combineReducers({adminOrder, auth, dialog, notification}),
            applyMiddleware(thunk),
        );
    });

    it('should render admin order page', async () => {
        mock.onGet(/admin\/orders/).reply(200, orderPayload);
        const {getByText} = await renderWithStore(<Order match={{params: {id: orderPayload.extOrderId}}}/>, store);
        expect(await waitForElement(() => getByText(`Zamówienie ${orderPayload.extOrderId}`))).toBeDefined();
        const detailsLabel = await waitForElement(() => getByText('Szczegóły'));
        fireEvent.click(detailsLabel);
        expect(getByText(`${(orderPayload.totalWeight / 100).toFixed(2)} kg`)).toBeDefined();
    });

    it('should toggle visibility of buyer and buyer delivery sections', async () => {
        mock.onGet(/admin\/orders/).reply(200, orderPayload);
        const {getByText, queryByText} = await renderWithStore(<Order match={{params: {id: orderPayload.extOrderId}}}/>, store);
        expect(await waitForElement(() => getByText(`Zamówienie ${orderPayload.extOrderId}`))).toBeDefined();
        const [buyerLabel, buyerDeliveryLabel, productsLabel] = await Promise.all([
            waitForElement(() => getByText('Kupujący')),
            waitForElement(() => getByText('Dostawa')),
            waitForElement(() => getByText('Produkty')),
        ]);
        expect(queryByText(orderPayload.buyer.firstName)).toBeNull();
        fireEvent.click(buyerLabel);
        expect(getByText(orderPayload.buyer.firstName)).toBeDefined();
        fireEvent.click(buyerLabel);
        expect(queryByText(orderPayload.buyer.firstName)).toBeNull();
        expect(queryByText(orderPayload.buyer.delivery.street)).toBeNull();
        fireEvent.click(buyerDeliveryLabel);
        expect(getByText(orderPayload.buyer.delivery.street)).toBeDefined();
        fireEvent.click(buyerDeliveryLabel);
        expect(queryByText(orderPayload.buyer.delivery.street)).toBeNull();
        const productText = `${orderPayload.products[0].name} (${orderPayload.products[0].quantity} szt.)`;
        expect(queryByText(productText)).toBeNull();
        fireEvent.click(productsLabel);
        expect(getByText(productText)).toBeDefined();
        fireEvent.click(productsLabel);
        expect(queryByText(productText)).toBeNull();
    });

    it('should render error page on retrieve order failure', async () => {
        mock.onGet(/admin\/orders/).networkError();
        const {getByText} = await renderWithStore(<Order match={{params: {id: orderPayload.extOrderId}}}/>, store);
        expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
    });

    it('should cancel order', async () => {
        mock.onGet(/admin\/orders/).replyOnce(200, {...orderPayload, status: 'WAITING_FOR_CONFIRMATION'});
        mock.onPut(/admin\/orders/).replyOnce(200, {...orderPayload, status: 'CANCELED'});
        mock.onPost(/authorize/).replyOnce(200, authorizePayload);
        const {getByText, getByLabelText} = await renderWithStore(<Order match={{params: {id: orderPayload.extOrderId}}}/>, store);
        const detailsLabel = await waitForElement(() => getByText('Szczegóły'));
        fireEvent.click(detailsLabel);
        expect(getByText('WAITING_FOR_CONFIRMATION')).toBeDefined();
        const cancel = await waitForElement(() => getByLabelText('Anuluj zamówienie'));
        fireEvent.click(cancel);
        const no = getByText('Nie');
        fireEvent.click(no);
        fireEvent.click(cancel);
        const yes = getByText('Tak');
        fireEvent.click(yes);
        expect(await waitForElement(() => getByText('CANCELED'))).toBeDefined();
    });

    it('should show error notification on cancel order failure', async () => {
        mock.onGet(/admin\/orders/).replyOnce(200, {...orderPayload, status: 'WAITING_FOR_CONFIRMATION'});
        mock.onPut(/admin\/orders/).networkErrorOnce();
        mock.onPost(/authorize/).replyOnce(200, authorizePayload);
        const {getByText, getByLabelText} = await renderWithStore(<><Order match={{params: {id: orderPayload.extOrderId}}}/><NotificationBar/></>, store);
        fireEvent.click(await waitForElement(() => getByText('Szczegóły')));
        fireEvent.click(await waitForElement(() => getByLabelText('Anuluj zamówienie')));
        fireEvent.click(getByText('Tak'));
        expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
    });

    it('should delete order', async () => {
        mock.onGet(/admin\/orders/).replyOnce(200, {...orderPayload, status: 'LOCAL_NEW_REJECTED'});
        mock.onDelete(/admin\/orders/).replyOnce(204);
        mock.onPost(/authorize/).replyOnce(200, authorizePayload);
        const {getByText, getByLabelText} = await renderWithStore(<Order match={{params: {id: orderPayload.extOrderId}}}/>, store);
        const detailsLabel = await waitForElement(() => getByText('Szczegóły'));
        fireEvent.click(detailsLabel);
        expect(getByText('LOCAL_NEW_REJECTED')).toBeDefined();
        const deleteOrder = await waitForElement(() => getByLabelText('Usuń zamówienie'));
        fireEvent.click(deleteOrder);
        const no = getByText('Nie');
        fireEvent.click(no);
        fireEvent.click(deleteOrder);
        const yes = getByText('Tak');
        fireEvent.click(yes);
    });

    it('should show error notification on delete order failure', async () => {
        mock.onGet(/admin\/orders/).replyOnce(200, {...orderPayload, status: 'LOCAL_NEW_REJECTED'});
        mock.onDelete(/admin\/orders/).networkErrorOnce();
        mock.onPost(/authorize/).replyOnce(200, authorizePayload);
        const {getByText, getByLabelText} = await renderWithStore(<><Order match={{params: {id: orderPayload.extOrderId}}}/><NotificationBar/></>, store);
        fireEvent.click(await waitForElement(() => getByText('Szczegóły')));
        fireEvent.click(await waitForElement(() => getByLabelText('Usuń zamówienie')));
        fireEvent.click(getByText('Tak'));
        expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
    });

    it('should refund order', async () => {
        mock.onGet(/admin\/orders/).replyOnce(200, {...orderPayload, status: 'COMPLETED', refund: undefined});
        mock.onPost(/refunds/).replyOnce(200, {...orderPayload.refund, status: 'hello world'});
        mock.onPost(/authorize/).replyOnce(200, authorizePayload);
        const {getByText, getByLabelText} = await renderWithStore(<Order match={{params: {id: orderPayload.extOrderId}}}/>, store);
        const detailsLabel = await waitForElement(() => getByText('Szczegóły'));
        fireEvent.click(detailsLabel);
        expect(getByText('COMPLETED')).toBeDefined();
        const refundOrder = await waitForElement(() => getByLabelText('Zwróć środki na konto kupującego'));
        fireEvent.click(refundOrder);
        const no = getByText('Nie');
        fireEvent.click(no);
        fireEvent.click(refundOrder);
        const yes = getByText('Tak');
        fireEvent.click(yes);
    });

    it('should show error notification on refund order failure', async () => {
        mock.onGet(/admin\/orders/).replyOnce(200, {...orderPayload, status: 'COMPLETED', refund: undefined});
        mock.onPost(/refunds/).networkErrorOnce();
        mock.onPost(/authorize/).replyOnce(200, authorizePayload);
        const {getByText, getByLabelText} = await renderWithStore(<><Order match={{params: {id: orderPayload.extOrderId}}}/><NotificationBar/></>, store);
        fireEvent.click(await waitForElement(() => getByText('Szczegóły')));
        fireEvent.click(await waitForElement(() => getByLabelText('Zwróć środki na konto kupującego')));
        fireEvent.click(getByText('Tak'));
        expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
    });

    describe('event listeners', () => {

        describe('adminRefund', () => {

            const message = `Status zwrotu został zmieniony na ${orderPayload.refund.status}.`;

            it('should show notification on admin refund event', async () => {
                mock.onGet(/admin\/orders/).reply(200, orderPayload);
                const {getByText, queryByText} = await renderWithStore(<><Order match={{params: {id: orderPayload.extOrderId}}}/><NotificationBar/></>, store);
                expect(queryByText(message)).toBeNull();
                const refundLabel = await waitForElement(() => getByText('Zwrot'));
                socket.socketClient.emit('adminRefund', {order: orderPayload});
                expect(await waitForElement(() => getByText(message))).toBeDefined();
                expect(queryByText(orderPayload.refund.extRefundId)).toBeNull();
                fireEvent.click(refundLabel);
                expect(getByText(orderPayload.refund.extRefundId)).toBeDefined();
            });

        });

    });

});