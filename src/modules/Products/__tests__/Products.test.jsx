import React, {Fragment} from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {waitForElement, fireEvent} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Navigation from '../../../components/NavigationBar';
import Products from '../components/Products';
import NotificationBar from '../../../components/NotificationBar';
import auth from '../../../modules/Auth/reducer';
import {cart} from '../../../modules/ShoppingCart/reducer';
import dialog from '../../../reducers/dialog';
import notification from '../../../reducers/notification';
import {product, products} from '../reducer';

const productPayload = {
    active: true,
    stock: "5",
    images: [
        {
            avatar: "5da476864f651730df445456.avatar.jpg?abb63a0b73a1cc303570caed5ab39036",
            card: "5da476864f651730df445456.card.jpg?fc373385a066033dc2de08d152ffabd0",
            tile: "5da476864f651730df445456.tile.jpg?297aca95d06c26c3cf47fe98ce37c3c0",
        }
    ],
    description: "Lorem ipsum",
    longDescription: "Lorem ipsum",
    name: "Hello world",
    unitPrice: "35200",
    weight: "1200",
    slug: "hello-world",
    createdAt: "2020-01-01T13:22:14.129Z",
    updatedAt: "2020-01-01T13:22:14.636Z",
    id: "5da476864f651730df445457"
};

const productsPayload = [
    {
        active: true,
        stock: "29",
        images: [
            {
                avatar: "5da476864f651730df445456.avatar.jpg?abb63a0b73a1cc303570caed5ab39036",
                card: "5da476864f651730df445456.card.jpg?fc373385a066033dc2de08d152ffabd0",
                tile: "5da476864f651730df445456.tile.jpg?297aca95d06c26c3cf47fe98ce37c3c0",
            }
        ],
        description: "Rerum officia irure",
        longDescription: "Et sed cillum eiusmo",
        name: "Aaron Reese",
        unitPrice: "45100",
        weight: "2700",
        slug: "aaron-reese",
        createdAt: "2019-10-14T13:22:14.129Z",
        updatedAt: "2019-10-14T13:22:14.636Z",
        id: "5da476864f651730df445456"
    },
    {
        active: true,
        stock: "91",
        images: [{
            avatar: "5da5c9d24f651730df44545e.avatar.jpg?82c368ccdfc68ca2855b3cd78acfcbb2",
            card: "5da5c9d24f651730df44545e.card.jpg?c6afbd96a8053a416dac3049f26f33ce",
            tile: "5da5c9d24f651730df44545e.tile.jpg?ff23fd6a259cc3d463413ce026d5d514",
        }],
        description: "Adipisicing mollit u",
        longDescription: "Est dolore error sin",
        name: "Valentine Michael",
        unitPrice: "92900",
        weight: "4000",
        slug: "valentine-michael",
        createdAt: "2019-10-15T13:29:54.991Z",
        updatedAt: "2019-10-15T13:29:55.546Z",
        id: "5da5c9d24f651730df44545e"
    }
];

const productsPayload2 = [
    {
        active: true,
        stock: "29",
        images: [
            {
                avatar: "1da476864f651730df445456.avatar.jpg?abb63a0b73a1cc303570caed5ab39036",
                card: "1da476864f651730df445456.card.jpg?fc373385a066033dc2de08d152ffabd0",
                tile: "1da476864f651730df445456.tile.jpg?297aca95d06c26c3cf47fe98ce37c3c0",
            }
        ],
        description: "Serum officia irure",
        longDescription: "Fet sed cillum eiusmo",
        name: "Baron Cheese",
        unitPrice: "45200",
        weight: "2700",
        slug: "baron-reese",
        createdAt: "2019-11-14T13:22:14.129Z",
        updatedAt: "2019-11-14T13:22:14.636Z",
        id: "1da476864f651730df445456"
    },
    {
        active: true,
        stock: "91",
        images: [{
            avatar: "2da5c9d24f651730df44545e.avatar.jpg?82c368ccdfc68ca2855b3cd78acfcbb2",
            card: "2da5c9d24f651730df44545e.card.jpg?c6afbd96a8053a416dac3049f26f33ce",
            tile: "2da5c9d24f651730df44545e.tile.jpg?ff23fd6a259cc3d463413ce026d5d514",
        }],
        description: "Dipisicing mollit u",
        longDescription: "Fest dolore error sin",
        name: "Tina Michael",
        unitPrice: "93000",
        weight: "45000",
        slug: "tina-michael",
        createdAt: "2019-12-15T13:29:54.991Z",
        updatedAt: "2019-12-15T13:29:55.546Z",
        id: "2da5c9d24f651730df44545e"
    }
];

const productsLength = productsPayload.length;
const lastProduct = productsPayload[productsLength - 1];

const mock = new MockAdapter(axios);
let store;

describe('Products', () => {

    beforeEach(() => {
        mock.reset();
        store = createStore(
            combineReducers({auth, cart, dialog, notification, product, products}),
            applyMiddleware(thunk),
        );
        mock.onGet(`/products/${lastProduct.slug}`).replyOnce(200, lastProduct);
    });

    it('should merge existing records with new one on scroll to bottom', async () => {
        mock.onGet(/.*/).replyOnce(200, productsPayload);
        const {getByText, queryByText} = await renderWithRouter(<Products/>, store, {
            route: '/?limit=1',
        });
        await Promise.all([
            waitForElement(() => getByText(productsPayload[0].name)),
            waitForElement(() => getByText(productsPayload[1].name)),
        ]);
        mock.onGet(/.*/).replyOnce(200, [{
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
            waitForElement(() => getByText(productsPayload[0].name)),
            waitForElement(() => getByText(productsPayload[1].name)),
        ]);
        mock.onGet(/.*/).networkErrorOnce();
        window.innerHeight = -1000;
        fireEvent.scroll(window, {
            target: {
                scrollY: 0,
            }
        });
        await waitForElement(() => getByText('Abigail Brown'));
        expect(queryByText('Network Error')).toBeNull();
    });

    it('should render products list page and be able to enter product view page', async () => {
        const moreProductsPayload = [...productsPayload, ...productsPayload2];
        mock.onGet(/products/).replyOnce(200, moreProductsPayload);
        const {getByText, getByTestId} = await renderWithStore(<Products/>, store);
        let i;
        let productLink;
        for (i = 0; i < moreProductsPayload.length; i++) {
            const currentProduct = moreProductsPayload[i];
            productLink = await waitForElement(() => getByText(currentProduct.name));
            const productPrice = await waitForElement(() => getByText((currentProduct.unitPrice/100).toFixed(2)));
            const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${currentProduct.id}`));
            expect(productLink).toBeDefined();
            expect(productPrice).toBeDefined();
            expect(addToCartButton).toBeDefined();
        }
        expect(i).toBe(moreProductsPayload.length);
        expect(productLink.text).toBe(moreProductsPayload[moreProductsPayload.length - 1].name);
        fireEvent.click(productLink);
        expect(window.location.pathname).toBe(`/products/${moreProductsPayload[moreProductsPayload.length - 1].slug}`);
    });

    it("should add item to cart", async () => {
        mock.onGet(/products/).replyOnce(200, productsPayload);
        const {getByTestId, queryByTestId, queryByRole, getByRole} = await renderWithStore(<Fragment><Navigation/><Products/></Fragment>, store);
        const cartButton = getByTestId('cart-button');
        expect(cartButton).toBeDefined();
        const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${productsPayload[0].id}`));
        expect(queryByRole('dialog')).toBeNull();
        expect(queryByTestId('btn-continue')).toBeNull();
        expect(queryByTestId('btn-cart')).toBeNull();
        expect(addToCartButton).toBeDefined();
        expect(getByTestId('cart-badge').textContent).toBe('0');
        fireEvent.click(addToCartButton);
        const addedToCartDialog = await waitForElement(() => getByRole('dialog'));
        expect(addedToCartDialog).toBeDefined();
        expect(getByTestId('cart-badge').textContent).toBe('1');
        const continueShoppingButton = await waitForElement(() => getByTestId('btn-continue'));
        expect(continueShoppingButton).toBeDefined();
        fireEvent.click(continueShoppingButton);
        expect(queryByTestId('btn-continue')).toBeNull();
        expect(queryByRole('dialog')).toBeNull();
        fireEvent.click(addToCartButton);
        expect(getByRole('dialog')).toBeDefined();
        expect(getByTestId('cart-badge').textContent).toBe('2');
        const goToCartButton = getByTestId('btn-cart');
        expect(goToCartButton).toBeDefined();
        fireEvent.click(goToCartButton);
        expect(window.location.pathname).toBe('/cart');
    });

    it('should prevent from adding item to cart if the whole item stock already added', async () => {
        mock.onGet(/products/).replyOnce(200, productsPayload);
        const {getByTestId, queryByTestId} = await renderWithStore(<Fragment><Navigation/><Products/></Fragment>, store);
        const addToCartButton = await waitForElement(() => getByTestId(`add-to-cart-button-${lastProduct.id}`));
        let i = lastProduct.stock;
        while (i--) {
            expect(getByTestId(`add-to-cart-button-${lastProduct.id}`)).toBeDefined();
            fireEvent.click(addToCartButton);
            const continueShoppingButton = getByTestId('btn-continue');
            fireEvent.click(continueShoppingButton);
        }
        expect(queryByTestId(`add-to-cart-button-${lastProduct.id}`)).toBeNull();
    });

    describe('event listeners', () => {

        beforeEach(() => {
            mock.onGet(/products/).replyOnce(200, productsPayload);
        });

        describe('createProduct', () => {

            const message = `Produkt ${productPayload.name} został dodany.`;

            it('should show notification message when created product IS active', async () => {
                const {getByText, queryByText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(message)).toBeNull();
                socket.socketClient.emit('createProduct', {product: productPayload, isActive: productPayload.active});
                expect(getByText(message)).toBeDefined();
            });

            it('should not show notification message when created product IS NOT active', async () => {
                const {queryByText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(message)).toBeNull();
                socket.socketClient.emit('createProduct', {product: productPayload, isActive: false});
                expect(queryByText(message)).toBeNull();
            });

            test.each([
                [1, 'name'],
                [1, 'description'],
                [1, 'stock'],
                [1, 'active'],
                [-1, 'name'],
                [-1, 'description'],
                [-1, 'stock'],
                [-1, 'active'],
            ])('should merge newly created item with existing ones\' list based on sort and order', async (order, sort) => {
                mock.onGet(/.*/).replyOnce(200, productsPayload);
                const {getByText} = await renderWithRouter(<Fragment><Products/><NotificationBar /></Fragment>, store, {
                    route: `/?order=${order}&sort=${sort}`,
                });
                for (let i = 0; i < productsPayload.length; i++) {
                    expect(await waitForElement(() => getByText(productsPayload[i].name))).toBeDefined();
                }
                socket.socketClient.emit('createProduct', {product: productPayload, isActive: productPayload.active});
                expect(getByText(message)).toBeDefined();
            })

        });

        describe('updateProduct', () => {

            const updatedProductMessage = `Produkt ${productPayload.name} został zmieniony.`;
            const deletedProductMessage = `Produkt ${productPayload.name} został usunięty.`;
            const createdProductMessage = `Produkt ${productPayload.name} został dodany.`;

            it('should show updated product notification message when updated product WAS active and IS active', async () => {
                const {getByText, queryByText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(updatedProductMessage)).toBeNull();
                socket.socketClient.emit('updateProduct', {product: productPayload, wasActive: true, isActive: true});
                expect(getByText(updatedProductMessage)).toBeDefined();
            });

            it('should show deleted product notification message when updated product WAS active and IS NOT active', async () => {
                const {getByText, queryByText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(deletedProductMessage)).toBeNull();
                socket.socketClient.emit('updateProduct', {product: productPayload, wasActive: true, isActive: false});
                expect(getByText(deletedProductMessage)).toBeDefined();
            });

            it('should show created product notification message when updated product WAS NOT active and IS active', async () => {
                const {getByText, queryByText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(createdProductMessage)).toBeNull();
                socket.socketClient.emit('updateProduct', {product: productPayload, wasActive: false, isActive: true});
                expect(getByText(createdProductMessage)).toBeDefined();
            });

            it('should not show any notification message when updated product WAS NOT active and IS NOT active', async () => {
                const {queryByText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(updatedProductMessage)).toBeNull();
                expect(queryByText(deletedProductMessage)).toBeNull();
                expect(queryByText(createdProductMessage)).toBeNull();
                socket.socketClient.emit('updateProduct', {product: productPayload, wasActive: false, isActive: false});
                expect(queryByText(updatedProductMessage)).toBeNull();
                expect(queryByText(deletedProductMessage)).toBeNull();
                expect(queryByText(createdProductMessage)).toBeNull();
            });

        });

        describe('deleteProduct', () => {

            const message = `Produkt ${productPayload.name} został usunięty.`;

            it('should show notification message when deleted product WAS active', async () => {
                const {getByText, queryByText, getByLabelText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(message)).toBeNull();
                socket.socketClient.emit('deleteProduct', {product: productPayload, wasActive: true});
                expect(getByText(message)).toBeDefined();
                const closeMessage = getByLabelText('Close');
                fireEvent.click(closeMessage);
                expect(queryByText(message)).toBeNull();
            });

            it('should not show notification message when deleted product WAS NOT active', async () => {
                const {queryByText} = await renderWithStore(<Fragment><Products/><NotificationBar /></Fragment>, store);
                expect(queryByText(message)).toBeNull();
                socket.socketClient.emit('deleteProduct', {product: productPayload, wasActive: false});
                expect(queryByText(message)).toBeNull();
            });

        });

    });

});
