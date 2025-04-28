import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';

const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    lastName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
});

function CustomInput(props) {
    console.log('props:', props)
    return (
        // <textarea {...props} ></textarea>
        <TextField {...props} id="outlined-basic" label="Outlined" variant="outlined" />

    )
}

export function MyForm() {
    return (
        <div>
            <h1>Signup</h1>
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                }}
                validationSchema={SignupSchema}
                onSubmit={values => {
                    // same shape as initial values
                    console.log(values);
                }}
            >
                {({ errors, touched }) => (
                    <Form className="my-form">
                        {/* {console.log('errors, touched:', errors, touched)} */}
                        <Field as={CustomInput} name="firstName" placeholder="first name" />
                        {errors.firstName && touched.firstName &&
                            <div>{errors.firstName}</div>}
                        <Field name="lastName" />
                        {errors.lastName && touched.lastName &&
                            <div>{errors.lastName}</div>}
                        <Field name="email" type="email" />
                        {errors.email && touched.email &&
                            <div>{errors.email}</div>}

                        <button type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}


