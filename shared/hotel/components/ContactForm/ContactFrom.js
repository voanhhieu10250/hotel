import React from 'react';
import { Field, Form } from 'formik';
import { AntInput, AntTextArea } from '@iso/ui/Antd/AntdInputWithFormik';
import Button from '@iso/ui/Antd/Button/Button';
import Row from '@iso/ui/Antd/Grid/Row';
import Col from '@iso/ui/Antd/Grid/Col';
import FormWrapper from './ContactForm.style';

const ContactForm = ({ values, submitCount, handleSubmit }) => (
  <FormWrapper>
    <Form onSubmit={handleSubmit}>
      <Field
        component={AntTextArea}
        name="message"
        type="text"
        size="large"
        label="Your Message"
        submitCount={submitCount}
        value={values.message}
        hasFeedback
      />

      <Row gutter={30}>
        <Col md={12}>
          <Field
            component={AntInput}
            name="email"
            type="email"
            size="large"
            label="Your Email"
            submitCount={submitCount}
            value={values.email}
            hasFeedback
          />
        </Col>
        <Col md={12}>
          <Field
            component={AntInput}
            name="contact"
            type="number"
            size="large"
            label="Your Contact"
            value={values.contact}
            submitCount={submitCount}
            hasFeedback
          />
        </Col>
      </Row>

      <Button
        className="signin-btn"
        type="primary"
        htmlType="submit"
        size="large"
      >
        Submit
      </Button>
    </Form>
  </FormWrapper>
);

export default ContactForm;
