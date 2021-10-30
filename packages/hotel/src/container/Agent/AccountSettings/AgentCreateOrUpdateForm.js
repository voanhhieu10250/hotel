import React, { Fragment, useState } from 'react';
import moment from 'moment';
import { Formik } from 'formik';
import * as Yup from 'yup';
import RenderCreateOrUpdateForm from '@hotel/components/Agent/RenderCreateOrUpdateForm';
import { dateFormat } from '@iso/lib/helpers/validators/fieldFormats';
import { FormTitle } from './AccountSettings.style';
import { apiInstance } from '../../../context/AuthProvider';
import { Alert } from 'antd';

let initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  agentGender: '',
  phone_number: '',
  preferredLanguage: '',
  address: '',
  describeYourself: '',
  dateOfBirthday: moment(),
  genderOptions: ['Male', 'Female', 'Other'],
  languageOptions: [
    'English',
    'Vietnamese',
    'Spanish',
    'French',
    'Japanese',
    'Chinese',
    'Russia',
  ],
};

const profileBuildValidationSchema = () => {
  const maxDate = moment();
  const date = new Date(maxDate);
  return Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is Required!'),
    firstName: Yup.string().required('First Name is Required!'),
    lastName: Yup.string().required('Last Name is Required!'),
    phone_number: Yup.string().required('Phone number is Required!'),
    address: Yup.string().required('Address is Required!'),
    dateOfBirthday: Yup.date()
      .default(date)
      .max(
        maxDate,
        `Date of Birth should not be equal or later than ${maxDate}`
      )
      .required('Date of Birth date required'),
    preferredLanguage: Yup.string()
      .oneOf([
        'English',
        'Vietnamese',
        'Spanish',
        'French',
        'Japanese',
        'Chinese',
        'Russia',
      ])
      .required('Please choose your preferred language'),
    agentGender: Yup.string()
      .oneOf(['Male', 'Female', 'Other'])
      .required('Please select Gender information'),
  });
};

export default ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  initialValues = {
    ...initialValues,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    agentGender: user.gender === 'string' ? 'Male' : user.gender,
    phone_number:
      user.cellNumber === 'secretadmin' ? '0987654321' : user.cellNumber,
    preferredLanguage: user.language === 'string' && 'English',
    describeYourself: user.content || '',
    address: '...',
    dateOfBirthday: moment(user.dateOfBirth).isValid()
      ? moment(user.dateOfBirth)
      : moment(),
  };

  const handleSubmit = async formProps => {
    const {
      firstName,
      lastName,
      email,
      agentGender,
      phone_number,
      preferredLanguage,
      describeYourself,
      dateOfBirthday,
    } = formProps;
    const selectedDate = moment(dateOfBirthday).format(dateFormat);

    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data } = await apiInstance({
        url: 'user/update-user',
        data: {
          cellNumber: phone_number,
          content: describeYourself,
          dateOfBirth: selectedDate,
          email: email,
          firstName: firstName,
          gender: agentGender,
          id: user.id,
          language: preferredLanguage,
          lastName: lastName,
        },
        method: 'PUT',
      });
      console.log(data);
      if (data.status === 200) setSuccess('Your information has updated !');
    } catch (error) {
      console.log(error);
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <Fragment>
      <FormTitle>Basic Information</FormTitle>
      {error && <Alert message={error} type="error" />}
      {success && <Alert message={success} type="success" />}
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        render={RenderCreateOrUpdateForm}
        validationSchema={profileBuildValidationSchema}
      />
    </Fragment>
  );
};
