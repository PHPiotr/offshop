import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = () => ({
    imageContainer: {
        width: '85%',
        height: '80%',
        position: 'relative',
    },
    image: {
        maxHeight: '240px',
        margin: '0 auto',
    },
});

const ImagePreview = ({imagefile, classes}) =>
    imagefile.map(({name, preview, size}) => (
        <div key={name}>
            <div className={classes.imageContainer}>
                <img  className={classes.image} src={preview} alt={name}/>
            </div>
            <div>
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
