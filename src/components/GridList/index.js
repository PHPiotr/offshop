import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import stroik_1 from '../../images/stroik_1.jpg';
import stroik_2 from '../../images/stroik_2.jpg';
import stroik_3 from '../../images/stroik_3.jpg';
import stroik_4 from '../../images/stroik_4.jpg';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
});

const tileData = [
    {
        img: stroik_1,
        title: 'Stroik 1',
        price: '55',
        inCart: true,
    },
    {
        img: stroik_2,
        title: 'Stroik 2',
        price: '30',
        inCart: false,
    }, {
        img: stroik_3,
        title: 'Stroik 3',
        price: '45',
        inCart: false,
    }, {
        img: stroik_4,
        title: 'Stroik 4',
        price: '35',
        inCart: false,
    },
];

function TitlebarGridList(props) {
    const {classes} = props;

    return (
        <div className={classes.root}>
            <GridList cellHeight={`auto`} className={classes.gridList}>
                <GridListTile key="Subheader" cols={2} style={{height: 'auto'}}>
                    <ListSubheader component="div">Kompozycje</ListSubheader>
                </GridListTile>
                {tileData.map(tile => (
                    <GridListTile key={tile.img}>
                        <img src={tile.img} alt={tile.title}/>
                        <GridListTileBar
                            title={tile.title}
                            subtitle={<span>{tile.price} zł</span>}
                            actionIcon={
                                <IconButton className={classes.icon}>
                                    {tile.inCart ? <RemoveShoppingCartIcon/> : <AddShoppingCartIcon/>}
                                </IconButton>
                            }
                        />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}

TitlebarGridList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TitlebarGridList);
