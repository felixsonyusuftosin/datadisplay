import React, { useState, useEffect} from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { NotificationTypes } from '../types'
import MuiAlert from '@material-ui/lab/Alert';


type SnackbarProps = { 
  message: string,
  context: NotificationTypes
}

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const Notification: React.FC<SnackbarProps> = ({message, context }) => { 

  const [open, setOpen ] = useState(Boolean(message))

  useEffect(() => { 
     setOpen(Boolean(message))
  }, [ message])

  const handleClose = (event:any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false); 
  }
  
return (
<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity={context}>
    {message}
  </Alert>
</Snackbar>
)
}

export default Notification