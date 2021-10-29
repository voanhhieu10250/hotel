import React, { Fragment, useState } from 'react';
import { Formik } from 'formik';
import RenderChangePassWordForm from '@hotel/components/ChangePassWord/RenderChangePassWordForm';
import * as Yup from 'yup';
import { FormTitle } from './AccountSettings.style';
import { Alert } from 'antd';
import { apiInstance } from '../../../context/AuthProvider';

const initialValues = {
  newPassWord: '',
  confrimNewPassWord: '',
};

const getChangePassWordValidationSchema = () => {
  return Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password has to be longer than 6 characters!')
      .max(20, 'Too Long!')
      .required('Old Password is required!'),
    newPassWord: Yup.string()
      .min(6, 'Password has to be longer than 6 characters!')
      .max(20, 'Too Long!')
      .required('New Password is required!'),
    confrimNewPassWord: Yup.string()
      .oneOf([Yup.ref('newPassWord'), null], 'Passwords are not the same!')
      .required('Password confirmation is required'),
  });
};

export default function ChangePassWord({ user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async formProps => {
    const { newPassWord } = formProps;

    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data } = await apiInstance({
        url: 'user/update-user',
        data: {
          password: newPassWord,
          id: user.id,
        },
        method: 'PUT',
      });

      console.log(data);

      if (data.status === 200) setSuccess('Your password has updated !');
    } catch (error) {
      console.log(error);
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <Fragment>
      <FormTitle>Change Password</FormTitle>
      {error && <Alert message={error} type="error" />}
      {success && <Alert message={success} type="success" />}
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        render={RenderChangePassWordForm}
        validationSchema={getChangePassWordValidationSchema}
      />
    </Fragment>
  );
}
