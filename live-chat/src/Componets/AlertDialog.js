// AlertDialog.jsx

import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Define the AlertDialog component
function AlertDialog({ open, handleClose,handleAgree,message }) {
  // `open` prop controls whether the dialog is open or closed
  const handleAgreeClick = () => {
    handleAgree(); 
    handleClose(); 
  };
  return (
    <Dialog
      open={open} // Controlled by the `open` prop
      onClose={handleClose} // Handle close action, controlled by parent component
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{message}</DialogTitle>
      <DialogActions>
        <Button onClick={handleAgreeClick}>Yes</Button>
        <Button onClick={handleClose}>No</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AlertDialog;
