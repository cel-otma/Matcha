import React from 'react'
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function RatingStar() {

    const [value, setValue] = React.useState('');
    return (
        <div className="RatingStar">
                <Box component="fieldset"  borderColor="transparent">
                    <Typography component="legend">Rating</Typography>
                    <Rating
                    name="simple-controlled"
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    />
                </Box>
        </div>
    )
}
export default  RatingStar