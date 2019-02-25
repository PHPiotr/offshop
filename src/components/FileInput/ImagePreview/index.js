import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = () => ({
    root: {
        textAlign: 'center',
        backgroundColor: '#efebeb',
        height: '100%',
        width: '100%',
        borderRadius: '5px',
    },
    imageContainer: {
        alignItems: 'center',
        display: 'flex',
        width: '85%',
        height: '80%',
        float: 'left',
        margin: '15px 10px 10px 37px',
        textAlign: 'center',
    },
    image: {
        maxHeight: '240px',
        margin: '0 auto',
    },
    details: {
        textAlign: 'center',
    },
});

const ImagePreview = ({imagefile, classes}) =>
    imagefile.map(({name, preview, size}) => (
        <div key={name} className={classes.root}>
            <div className={classes.imageContainer}>
                <img  className={classes.image} src={preview} alt={name}/>
            </div>
            <div className={classes.details}>
                {name} - {(size / 1024000).toFixed(2)}MB
            </div>
        </div>
    ));

ImagePreview.propTypes = {
    imagefile: PropTypes.arrayOf(
        PropTypes.shape({
            file: PropTypes.file,
            name: PropTypes.string,
            preview: PropTypes.string,
            size: PropTypes.number
        })
    )
};

export default withStyles(styles)(ImagePreview);
