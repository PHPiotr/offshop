const initialState = {
    currentId: '1',
    items: [
        {
            'id': '1',
            'title': 'Kompozycje',
            'slug': 'kompozycje',
            'active': true,
            'parentId': null,
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
