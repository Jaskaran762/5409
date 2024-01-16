import React, { useRef } from 'react';

function Popup({ trigger, position, onClose, children }) { 
    // Create a ref to access the dialog element 
    const dialogRef = useRef();

    // Define a function to open the dialog 
    const openDialog = () => { dialogRef.current.showModal(); };

    // Define a function to close the dialog 
    const closeDialog = () => { dialogRef.current.close(); onClose(); };

    return ( 
    <> 
    {/* Render the trigger element and attach the openDialog function */} 
    {React.cloneElement(trigger, { onClick: openDialog })}
     {/* Render the dialog element and attach the closeDialog function */}
     <dialog ref={dialogRef} style={{ position: position }} onClick={closeDialog} > 
        {children}
      </dialog> 
     </> 
     ); }

export default Popup;