import React, { useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Row from '@iso/ui/Antd/Grid/Row';
import Col from '@iso/ui/Antd/Grid/Col';
import Heading from '@iso/ui/Heading/Heading';
import Text from '@iso/ui/Text/Text';
import Loader from '@hotel/components/Loader/Loader';
import ContactForm from '@hotel/components/ContactForm/ContactFrom';
import { AgentContactWrapper, ContactDetails } from './AgentDetails.style';
import isEmpty from 'lodash/isEmpty';
import { AuthContext } from '../../../context/AuthProvider';

const getContactFormValidation = () => {
  return Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is Required!'),
    message: Yup.string().required('Message is required!'),
    contact: Yup.string().required('Contact is required!'),
  });
};

const AgentContact = ({
  agentId = '',
  agentEmail = '',
  agentCellNumber = '',
  match,
}) => {
  const { user, loading } = useContext(AuthContext);
  console.log(match);
  if (isEmpty(user) || loading) return <Loader />;

  const handleSubmit = async formProps => {
    console.log(formProps, 'formProps');
    // const email = formProps ? formProps.email : "";
    // const message = formProps ? formProps.message : "";
    // const contact = formProps ? formProps.contact : "";

    // const result = await apiInstance.post("message/create-new-message", {
    //   agentId: agentId,
    //   message: message,
    //   senderContact: contact,
    //   senderEmail: email,
    // });
  };

  return (
    <AgentContactWrapper>
      <Heading content="Send Messege" />
      <Row gutter={30}>
        <Col lg={16}>
          <Formik
            initialValues={{
              email: user.email,
              message: '',
              contact: user.cellNumber,
            }}
            onSubmit={handleSubmit}
            render={ContactForm}
            validationSchema={getContactFormValidation}
          />
        </Col>
        <Col lg={8}>
          <ContactDetails>
            <Heading as="h3" content="Phone No" />
            <Text
              content={
                agentCellNumber === 'secretadmin'
                  ? '0987654321'
                  : 'User cell number'
              }
            />
            <Heading as="h3" content="Email" />
            <Text content={agentEmail} />
            <Heading as="h3" content="Language" />
            <Text content={'English'} />
          </ContactDetails>
        </Col>
      </Row>
    </AgentContactWrapper>
  );
};

export default AgentContact;
