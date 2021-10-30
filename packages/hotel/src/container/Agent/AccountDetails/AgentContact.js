import React, { useContext, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Row from '@iso/ui/Antd/Grid/Row';
import Col from '@iso/ui/Antd/Grid/Col';
import Heading from '@iso/ui/Heading/Heading';
import Text from '@iso/ui/Text/Text';
import Loader from '@hotel/components/Loader/Loader';
import ContactForm from '@hotel/components/ContactForm/ContactFrom';
import { AgentContactWrapper, ContactDetails } from './AgentDetails.style';
import { apiInstance, AuthContext } from '../../../context/AuthProvider';
import { Alert } from 'antd';

const getContactFormValidation = () => {
  return Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is Required!'),
    message: Yup.string().required('Message is required!'),
    contact: Yup.string().required('Contact is required!'),
  });
};

const AgentContact = ({ data, loading }) => {
  const { user } = useContext(AuthContext);
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [messageSuccess, setMessageSuccess] = useState(null);

  const ownContact = user && user.id === data.id;
  if (loading) return <Loader />;

  const handleSubmit = async formProps => {
    console.log(formProps, 'formProps');
    const email = formProps ? formProps.email : '';
    const message = formProps ? formProps.message : '';
    const contact = formProps ? formProps.contact : '';

    setMessageLoading(true);
    setMessageError(null);
    setMessageSuccess(null);

    try {
      const result = await apiInstance.post('message/create-new-message', {
        agentId: data.id,
        message: message,
        senderContact: contact,
        senderEmail: email,
      });
      console.log(result.data);
      if (result.data.status === 201) {
        setMessageSuccess('Your message has been sent.');
      } else {
        setMessageError('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.log(error);
      setMessageError('Something went wrong. Please try again later.');
    }

    setMessageLoading(false);
  };

  return (
    <AgentContactWrapper>
      <Heading content={ownContact ? 'Your Contact Info' : 'Send Messege'} />
      <Row gutter={30}>
        {!ownContact && (
          <Col lg={16}>
            {messageError && <Alert message={messageError} type="error" />}
            {messageSuccess && (
              <Alert message={messageSuccess} type="success" />
            )}
            {messageLoading && <Alert message="Loading ..." type="success" />}
            <Formik
              initialValues={{
                email: user?.email || '',
                message: '',
                contact: user?.cellNumber || '',
              }}
              onSubmit={handleSubmit}
              render={ContactForm}
              validationSchema={getContactFormValidation}
            />
          </Col>
        )}
        <Col lg={8}>
          <ContactDetails>
            <Heading as="h3" content="Phone No" />
            <Text
              content={
                data.cellNumber === 'secretadmin'
                  ? '0987654321'
                  : 'User cell number'
              }
            />
            <Heading as="h3" content="Email" />
            <Text content={data.email} />
            <Heading as="h3" content="Language" />
            <Text
              content={
                data.language && data.language !== 'string'
                  ? data.language
                  : 'English'
              }
            />
          </ContactDetails>
        </Col>
      </Row>
    </AgentContactWrapper>
  );
};

export default AgentContact;
