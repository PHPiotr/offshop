import React, {Fragment, useState, useEffect, useContext} from 'react';
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
import FloatingAddButton from '../../../../components/FloatingAddButton';
import Dialog from '../../../../components/Dialog';
import ProgressIndicator from '../../../../components/ProgressIndicator';
import {getAdminDeliveryMethodsIfNeeded, deleteDeliveryMethodIfNeeded} from '../../actions';
import {showNotification} from '../../../../actions/notification';
import ErrorPage from '../../../../components/ErrorPage';

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

const DeliveryMethodsList = props => {
    const [sort] = useState('name');
    const [order] = useState(1);

    useEffect(() => {
        props.getAdminDeliveryMethodsIfNeeded({sort, order});
    }, []);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [deliveryMethodToDelete, setDeliveryMethodToDelete] = useState({});

    const toggleDialog = () => setDialogOpen(!isDialogOpen);

    const showDeleteDeliveryMethodPrompt = deliveryMethodToDelete => () => {
        setDeliveryMethodToDelete(deliveryMethodToDelete);
        toggleDialog();
    };

    const handleDeleteDeliveryMethod = async () => {
        toggleDialog();
        try {
            await props.deleteDeliveryMethodIfNeeded(deliveryMethodToDelete.id);
        } catch (e) {
            props.showNotification({message: e.message, variant: 'error'});
        }
    };

    if (props.error) {
        return <ErrorPage message={props.error.message}/>;
    }

    return (
        <Fragment>
            {props.isFetching && <ProgressIndicator />}
            <List className={props.classes.root} disablePadding>
                {props.data.map((p, i) => (
                    <Fragment key={p.id}>
                        <ListItem key={p.id} alignItems="flex-start" button component={Link} to={`/admin/delivery-methods/${p.id}`}>
                            <ListItemText
                                primary={p.name}
                                secondary={`${(p.unitPrice / 100).toFixed(2)} zł`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    data-testid={`delete-btn-${p.id}`}
                                    onClick={showDeleteDeliveryMethodPrompt(p)}
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
                title={`Usunąć ${deliveryMethodToDelete.name}?`}
                actions={
                    [
                        <Button key="1" onClick={handleDeleteDeliveryMethod} color="primary">
                            Tak
                        </Button>,
                        <Button key="2" onClick={toggleDialog} color="primary">
                            Nie
                        </Button>,
                    ]
                }
            />
            <FloatingAddButton to="/admin/delivery-methods/new" />
        </Fragment>
    );
};

DeliveryMethodsList.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    data: state.adminDeliveryMethods.ids.map(i => state.adminDeliveryMethods.data[i]),
    isFetching: state.adminDeliveryMethods.isFetching,
    error: state.adminDeliveryMethods.error,
});

const mapDispatchToProps = {
    getAdminDeliveryMethodsIfNeeded,
    deleteDeliveryMethodIfNeeded,
    showNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DeliveryMethodsList));
