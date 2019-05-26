import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '../../components/Dialog';
import ProgressIndicator from '../../components/ProgressIndicator';
import {getAdminDeliveryMethodsIfNeeded, deleteDeliveryMethodIfNeeded} from '../../actions/admin/deliveryMethods';

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

const DeliveryMethodsList = props => {
    useEffect(() => {
        props.getAdminDeliveryMethodsIfNeeded();
    }, []);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [deliveryMethodToDelete, setDeliveryMethodToDelete] = useState({});

    const toggleDialog = () => setDialogOpen(!isDialogOpen);

    const showDeleteDeliveryMethodPrompt = deliveryMethodToDelete => () => {
        setDeliveryMethodToDelete(deliveryMethodToDelete);
        toggleDialog();
    };

    const handleDeleteDeliveryMethod = () => {
        toggleDialog();
        props.deleteDeliveryMethodIfNeeded(deliveryMethodToDelete.id);
    };

    return (
        <Fragment>
            {props.isFetching && <ProgressIndicator />}
            <List className={props.classes.root}>
                {props.data.map((p, i) => (
                    <Fragment key={p._id}>
                        <ListItem key={p._id} alignItems="flex-start" button component={Link} to={`/admin/delivery-methods/${p.id}`}>
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
});

const mapDispatchToProps = {
    getAdminDeliveryMethodsIfNeeded,
    deleteDeliveryMethodIfNeeded
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DeliveryMethodsList));