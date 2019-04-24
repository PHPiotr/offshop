import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import {connect} from 'react-redux';

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
    const {classes, products} = props;

    return (
        <List className={classes.root}>
            {products.map((p, i) => (
                <Fragment key={p._id}>
                    <ListItem key={p._id} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar src={`${process.env.REACT_APP_API_HOST}/images/products/${p.slug}.avatar.png`}
                                    alt={p.name}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={p.name}
                            secondary={
                                <Typography
                                    component="span"
                                    className={classes.inline}
                                    color="textPrimary"
                                >
                                    {`${p.unitPrice} zł`}
                                </Typography>
                            }
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                id={p._id}
                                onClick={() => null}
                                disabled={false}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    {i < products.length - 1 && <Divider/>}
                </Fragment>
            ))}
        </List>
    );
};

ProductsList.propTypes = {
    classes: PropTypes.object.isRequired,
    products: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    products: state.products.ids.map(i => state.products.data[i]),
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProductsList));
