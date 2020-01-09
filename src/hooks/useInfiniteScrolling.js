import {useEffect, useState} from 'react';

const useInfiniteScrolling = config => {
    const [sort] = useState(config.sort || 'createdAt');
    const [order] = useState(config.order || -1);
    const [limit] = useState(config.limit || 20);
    const [skip, setSkip] = useState(config.skip || 0);
    const [hasMoreData, setHasMoreData] = useState(true);
    useEffect(() => {
        if (!hasMoreData) {
            return;
        }
        config.getItems({sort, order, limit, skip}).then(payload => {
            if (payload && payload.result && payload.result.length < limit) {
                setHasMoreData(false);
            }
        });
    }, [sort, order, limit, skip]);

    useEffect(() => {
        window.onscroll = () => {
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                setSkip(skip + limit);
            }
        };
        return () => {
            window.onscroll = null;
        }
    });
};

export default useInfiniteScrolling;
