import React, {Fragment, useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Link, withRouter} from 'react-router-dom';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import {connect} from 'react-redux';
import queryString from 'query-string';
import Button from '@material-ui/core/Button';
import Dialog from '../../../../components/Dialog';
import FloatingAddButton from '../../../../components/FloatingAddButton';
import ProgressIndicator from '../../../../components/ProgressIndicator';
import {getAdminProductsIfNeeded, deleteProductIfNeeded} from '../../../../modules/Products/actions';
import {showNotification} from '../../../../actions/notification';
import useInfiniteScrolling from '../../../../hooks/useInfiniteScrolling';
import SocketContext from '../../../../contexts/SocketContext';
import ErrorPage from '../../../../components/ErrorPage';
import Empty from '../../../../components/Empty';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    textField: {
        marginLeft: 0,
        marginRight: 0,
        width: '45px',
        textAlign: 'center',
        borderRadius: 0,
        padding: 0,
    },
});

const ProductsList = props => {
    const socket = useContext(SocketContext);
    const {getAdminProductsIfNeeded} = props;
    useInfiniteScrolling({
        sort: 'name',
        order: 1,
        ...queryString.parse(props.location.search),
        getItems: getAdminProductsIfNeeded,
    });

    const onAdminDeleteProductListener = ({product}) => props.showNotification({
        message: `Produkt ${product.name} został usunięty.`,
        variant: 'warning',
    });

    useEffect(() => {
        socket.on('adminDeleteProduct', onAdminDeleteProductListener);
        return () => {
            socket.off('adminDeleteProduct', onAdminDeleteProductListener);
        }
    }, []);

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState({});

    const toggleDialog = () => setDialogOpen(!isDialogOpen);

    const showDeleteProductPrompt = productToDelete => () => {
        setProductToDelete(productToDelete);
        toggleDialog();
    };

    const handleDeleteProduct = async () => {
        toggleDialog();
        try {
            await props.deleteProductIfNeeded(productToDelete.id);
        } catch (e) {
            props.showNotification({
                message: e.message,
                variant: 'error',
            });
        }
    };

    if (props.error) {
        return <ErrorPage message={props.error.message} />
    }

    return (
        <Fragment>
            {props.isFetching && <ProgressIndicator />}
            {!props.isFetching && !props.products.length && (
                <Empty label="Brak produktów" linkLabel="Dodaj produkt" linkTo="/admin/products/new" />
            )}
            <List className={props.classes.root} disablePadding>
                {props.products.map((p, i) => (
                    <Fragment key={p.id}>
                        <ListItem key={p.id} alignItems="flex-start" button component={Link} to={`/admin/products/${p.id}`}>
                            <ListItemAvatar>
                            {p.active ? (
                                <Tooltip title="Produkt aktywny">
                                    <Badge variant="dot" color="error">
                                        <Avatar src={`${process.env.REACT_APP_PRODUCT_PATH}/${p.images[0].avatar}`}
                                                alt={p.name}/>
                                    </Badge>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Produkt nieaktywny">
                                    <Avatar src={`${process.env.REACT_APP_PRODUCT_PATH}/${p.images[0].avatar}`}
                                            alt={p.name}/>
                                </Tooltip>
                            )}
                            </ListItemAvatar>
                            <ListItemText
                                primary={p.name}
                                secondary={`${(p.unitPrice / 100).toFixed(2)} zł`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    aria-label={`Delete product ${p.id}`}
                                    onClick={showDeleteProductPrompt(p)}
                                    disabled={false}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {i < props.products.length - 1 && <Divider/>}
                    </Fragment>
                ))}
            </List>
            <Dialog
                open={isDialogOpen}
                onClose={toggleDialog}
                title={`Usunąć ${productToDelete.name}?`}
                actions={
                    [
                        <Button key="1" onClick={handleDeleteProduct} color="primary">
                            Tak
                        </Button>,
                        <Button key="2" onClick={toggleDialog} color="primary">
                            Nie
                        </Button>,
                    ]
                }
            />
            <FloatingAddButton to="/admin/products/new" />
        </Fragment>
    );
};

ProductsList.propTypes = {
    classes: PropTypes.object.isRequired,
    products: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    products: state.adminProducts.ids.map(i => state.adminProducts.data[i]),
    isFetching: state.adminProducts.isFetching,
    error: state.adminProducts.error,
});

const mapDispatchToProps = {
    getAdminProductsIfNeeded,
    deleteProductIfNeeded,
    showNotification,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProductsList)));
