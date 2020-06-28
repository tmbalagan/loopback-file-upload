import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

function CustomAlert(variant, heading, message) {
    const [setShow] = useState(true);
    return (
        <Alert variant={variant} onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{heading}</Alert.Heading>
            <p>{message}</p>
        </Alert>
    );
}

export default CustomAlert;
