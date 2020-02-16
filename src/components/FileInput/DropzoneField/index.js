import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import DropZone from 'react-dropzone';
import ImagePreview from '../ImagePreview';
import Placeholder from '../Placeholder';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = () => ({
    upload: {
        cursor: 'pointer',
        height: '300px',
    },
});

const DropZoneField = ({handleOnDrop, input: {onChange}, imagefile, classes}) => (
    <div className={classes.root} data-testid="drop-zone-wrapper">
        <DropZone
            accept="image/jpeg, image/png"
            className={classes.upload}
            onDrop={file => handleOnDrop(file, onChange)}
            multiple={false}
        >
            {({getRootProps, getInputProps}) => {
                return imagefile && imagefile.length > 0 && imagefile[0] && imagefile[0].name ? (
                    <Fragment>
                        <Placeholder
                            getInputProps={getInputProps}
                            getRootProps={getRootProps}
                        />
                        <ImagePreview imagefile={imagefile}/>
                    </Fragment>
                ) : (
                    <Placeholder
                        getInputProps={getInputProps}
                        getRootProps={getRootProps}
                    />
                )
            }

            }
        </DropZone>
    </div>
);

DropZoneField.propTypes = {
    handleOnDrop: PropTypes.func.isRequired,
    imagefile: PropTypes.arrayOf(
        PropTypes.shape({
            file: PropTypes.file,
            name: PropTypes.string,
            preview: PropTypes.string,
            size: PropTypes.number
        })
    ),
    onChange: PropTypes.func,
};

export default withStyles(styles)(DropZoneField);
