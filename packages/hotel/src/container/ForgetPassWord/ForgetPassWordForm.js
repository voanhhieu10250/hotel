import React from 'react';
import { Formik } from 'formik';
import RenderForgetPassWordForm from '@hotel/components/ForgetPassWord/RenderForgetPassWordForm';
import * as Yup from 'yup';

const initialValues = {
  email: '',
};

const getForgetPassWordValidationSchema = () => {
  return Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is Required!'),
  });
};

const handleSubmit = formProps => {
  const { email } = formProps;
  alert(
    `\nHi ${email}\n\nWe have received your report. We will get back to you via email as soon as possible.`
  );
};

export default () => (
  <Formik
    initialValues={initialValues}
    onSubmit={handleSubmit}
    render={RenderForgetPassWordForm}
    validationSchema={getForgetPassWordValidationSchema}
  />
);
