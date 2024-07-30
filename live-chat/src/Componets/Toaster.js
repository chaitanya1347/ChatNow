import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


export default function Toaster(props) {
    console.log(props);

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={true} autoHideDuration={6000}   anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center', // Positioning at the bottom center
      }}>
        <Alert
          severity={props.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}