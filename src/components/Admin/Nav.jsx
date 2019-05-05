import React from 'react';
import {Link} from 'react-router-dom';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddCircle';
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from "@material-ui/core/Divider";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    listItem: {
        cursor: 'pointer',
    },
    link: {
        textDecoration: 'none',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    iconLink: {
        color: theme.palette.primary.dark
    }
});

const Nav = props => (
    <List subheader={<ListSubheader>Admin</ListSubheader>}>
        <Divider />
        <ListItem dense button className={props.classes.listItem}>
            <Link className={props.classes.link} to="/admin/products/list">
                <ListItemText primary={`Produkty`} />
            </Link>
            <ListItemSecondaryAction  className={props.classes.iconLink}>
                <IconButton aria-label="Dodaj produkt">
                    <Link className={props.classes.iconLink} to="/admin/products/new">
                        <AddIcon />
                    </Link>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
        <ListItem dense button className={props.classes.listItem}>
            <Link className={props.classes.link} to="/admin/delivery-methods">
                <ListItemText primary={`Opcje dostawy`} />
            </Link>

            <ListItemSecondaryAction>
                <IconButton aria-label="Dodaj metodę dostawy">
                    <Link className={props.classes.iconLink} to="/admin/delivery-methods/new">
                        <AddIcon />
                    </Link>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem dense button className={props.classes.listItem}>
            <Link className={props.classes.link} to="/logout">
                <ListItemText primary={`Wyloguj`} />
            </Link>
        </ListItem>
    </List>
);

export default withStyles(styles)(Nav);
