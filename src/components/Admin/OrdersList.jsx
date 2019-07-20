import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '../../components/Dialog';
import ProgressIndicator from '../../components/ProgressIndicator';
import {getAdminOrdersIfNeeded, deleteOrderIfNeeded} from '../../actions/admin/orders';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginBottom: '1rem',
        marginTop: '1rem',
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

const OrdersList = props => {
    useEffect(() => {
        props.getAdminOrdersIfNeeded();
    }, []);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({});

    const toggleDialog = () => setDialogOpen(!isDialogOpen);

    const showDeleteItemPrompt = itemToDelete => () => {
        setItemToDelete(itemToDelete);
        toggleDialog();
    };

    const handleDeleteItem = () => {
        toggleDialog();
        props.deleteOrderIfNeeded(itemToDelete.id);
    };

    return (
        <Fragment>
            {props.isFetching && <ProgressIndicator />}
            <List className={props.classes.root}>
                {props.data.map((p, i) => (
                    <Fragment key={p.id}>
                        <ListItem key={p.id} alignItems="flex-start" button component={Link} to={`/admin/orders/${p.id}`}>
                            <ListItemText
                                primary={p.extOrderId}
                                secondary={p.createdAt}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    onClick={showDeleteItemPrompt(p)}
                                    disabled={false}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {i < props.data.length - 1 && <Divider/>}
                    </Fragment>
                ))}
            </List>
            <Dialog
                open={isDialogOpen}
                onClose={toggleDialog}
                title={`Usunąć ${itemToDelete.name}?`}
                actions={
                    [
                        <Button key="1" onClick={handleDeleteItem} color="primary">
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

OrdersList.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    data: state.adminOrders.ids.map(i => state.adminOrders.data[i]),
    isFetching: state.adminOrders.isFetching,
});

const mapDispatchToProps = {
    getAdminOrdersIfNeeded,
    deleteOrderIfNeeded,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(OrdersList));
