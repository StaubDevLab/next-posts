'use client';
import React from 'react';
import {useFormStatus} from 'react-dom'
const FormSubmit = () => {
    const status = useFormStatus();
    if(status.pending){

    }
    return (
        <>
            <button type="reset">Reset</button>
            {status.pending ? <button>Creating post ...</button> :<button>Create</button> }

        </>
    );
};

export default FormSubmit;