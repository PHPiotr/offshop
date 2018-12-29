const initialState = {
    currentId: null,
    items: [
        {
            id: null,
            title: 'Kompozycje',
            slug: 'kompozycje',
            active: true,
            parentId: null,
        },
    ],
};

const categories = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default categories;
