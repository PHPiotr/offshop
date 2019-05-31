import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '../../components/Dialog';
import ProgressIndicator from '../../components/ProgressIndicator';
import {getAdminProductsIfNeeded, deleteProductIfNeeded} from '../../actions/admin/products';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginBottom: '1rem',
        marginTop: '1rem',
    },
    inline: {
        display: 'inline',
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
    useEffect(() => {
        props.getAdminProductsIfNeeded();
    }, []);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState({});

    const toggleDialog = () => setDialogOpen(!isDialogOpen);

    const showDeleteProductPrompt = productToDelete => () => {
        setProductToDelete(productToDelete);
        toggleDialog();
    };

    const handleDeleteProduct = () => {
        toggleDialog();
        props.deleteProductIfNeeded(productToDelete.id);
    };

    return (
        <Fragment>
            {props.isFetching && <ProgressIndicator />}
            <List className={props.classes.root}>
                {props.products.map((p, i) => (
                    <Fragment key={p.id}>
                        <ListItem key={p.id} alignItems="flex-start" button component={Link} to={`/admin/products/${p.id}`}>
                            <ListItemAvatar>
                            {!p.active ? (
                                <Tooltip title="Produkt nieaktywny">
                                    <Badge variant="dot" color="error">
                                        <Avatar src={`${process.env.REACT_APP_PRODUCT_PATH}/${p.id}.avatar.jpg`}
                                                alt={p.name}/>
                                    </Badge>
                                </Tooltip>
                            ) : (
                                <Avatar src={`${process.env.REACT_APP_PRODUCT_PATH}/${p.id}.avatar.jpg`}
                                        alt={p.name}/>
                            )}
                            </ListItemAvatar>
                            <ListItemText
                                primary={p.name}
                                secondary={
                                    <Typography
                                        component="span"
                                        className={props.classes.inline}
                                        color="textPrimary"
                                    >
                                        {`${p.unitPrice} zł`}
                                    </Typography>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton
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
});

const mapDispatchToProps = {
    getAdminProductsIfNeeded,
    deleteProductIfNeeded
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProductsList));
