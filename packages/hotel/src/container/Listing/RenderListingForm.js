import React, { Fragment, useState } from 'react';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import FormStepper from '@iso/ui/Steppers/FormStepper';
import { AntInput, AntTextArea } from '@iso/ui/Antd/AntdInputWithFormik';
import InputIncDec from '@iso/ui/InputIncDec/InputIncDec';
import Row from '@iso/ui/Antd/Grid/Row';
import Col from '@iso/ui/Antd/Grid/Col';
import Heading from '@iso/ui/Heading/Heading';
import Text from '@iso/ui/Text/Text';
import _ from 'lodash';
import {
  PorpertyType,
  Parking,
  Pool,
  AirCondition,
  ExtraBed,
} from '@hotel/components/Listing/RenderAmenitiesForm';

import { PhotoUploadComponent } from '@hotel/components/Listing/RenderUploadPhotosForm';
import { FormMapComponent } from '@hotel/components/Listing/RenderLocationInputForm';

import StepperWrapper, {
  UploaderWrapper,
  LocationWrapper,
  AmenitiesWrapper,
  HeaderSection,
  Title,
  Description,
} from '@hotel/components/Listing/AddListing.style';
import { Alert } from 'antd';
import { apiInstance } from '../../context/AuthProvider';
import { useHistory } from 'react-router';
import { SINGLE_POST_PAGE } from '../../settings/constant';

const required = value => (value ? undefined : 'Required');

const formValue = {
  hotelName: '',
  priceParNight: '',
  hotelDetails: '',
  guest: 0,
  beds: 0,
  price: 0,
  hotelPhotos: [],
  location: [],
  locationDescription: '',
  contactNumber: null,
  wifiAvailability: '',
  airCondition: '',
  parking: '',
  poolAvailability: '',
  extraBed: '',
};

const QuantityInput = ({ field, form }) => {
  const [state, setState] = useState(field ? field.value : 0);

  const handleIncrement = () => {
    let currentValue = state;
    setState(++currentValue);
    form.setFieldValue(field.name, ++currentValue);
  };

  const handleDecrement = () => {
    let currentValue = state;
    if (currentValue <= 0) {
      return false;
    }
    setState(--currentValue);
    form.setFieldValue(field.name, --currentValue);
  };

  const handleOnChange = e => {
    setState(e.target.value);
    form.setFieldValue(field.name, e.target.value);
  };

  return (
    <InputIncDec
      value={state}
      name={field && field.name}
      onChange={handleOnChange}
      increment={handleIncrement}
      decrement={handleDecrement}
    />
  );
};

const RenderCreateOrUpdateForm = ({ fieldLabel }) => {
  const [locationError, setLocationError] = useState(false);
  const [locationFieldBlured, setLocationFieldBlured] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  return (
    <StepperWrapper className="hotel-submission-form" $loading={loading}>
      <FormStepper
        initialValues={formValue}
        onSubmit={async (values, actions) => {
          console.log(values);
          if (loading) return;
          try {
            setLoading(true);
            // add amenities
            const { data: amenitiesData } = await apiInstance.post(
              'hotel/amenities/add-amenities',
              {
                airCondition: values.airCondition === 'yes' ? true : false,
                bedRoom: values.beds,
                extraBedFacility: values.extraBed === 'yes' ? true : false,
                guestRoom: values.guest,
                parkingAvailability: values.parking === 'yes' ? true : false,
                poolAvailability:
                  values.poolAvailability === 'yes' ? true : false,
                wifiAvailability:
                  values.wifiAvailability === 'free' ? true : false,
              }
            );

            if (amenitiesData.status !== 201) {
              alert(
                'Something went wrong with amenities. Please try again later !'
              );
              setLoading(false);
              actions.setSubmitting(false);
              return;
            }

            // add location
            const { data: locationData } = await apiInstance.post(
              'location/add-location',
              {
                city: values.location.city,
                countryLong: values.location.country_long,
                countryShort: values.location.country_short,
                formattedAddress: values.location.formattedAddress,
                lat: values.location.lat,
                lng: values.location.lng,
                numberOfPost: 0,
                stateLong: values.location.state_long,
                stateShort: values.location.state_short,
                zipcode: values.location.zipcode,
              }
            );

            if (locationData.status !== 201) {
              alert(
                'Something went wrong with location. Please try again later !'
              );
              setLoading(false);
              actions.setSubmitting(false);
              return;
            }

            // add hotel
            const nowTime = new Date().getTime();
            const genSlug =
              values.hotelName.replace(/[^A-Za-z0-9]/g, '-') + `-${nowTime}`;

            const { data: hotelData } = await apiInstance.post(
              'hotel/add-hotel',
              {
                amenitiesId: amenitiesData.content.id,
                condition: 'Very Good',
                contactNumber: values.contactNumber,
                content: values.hotelDetails,
                locationId: locationData.content.id,
                negotiable: true,
                price: values.priceParNight,
                ratingCount: 0,
                slug: genSlug,
                status: 'PUBLISH',
                termsAndCondition: 'Have a nice trip.',
                title: values.hotelName,
              }
            );

            if (hotelData.status !== 201) {
              alert(
                'Something went wrong with hotel data. Please try again later !'
              );
              setLoading(false);
              actions.setSubmitting(false);
              return;
            }

            // hotel images
            const { data: hotelImageData } = await apiInstance.post(
              'hotel-images/create-multiple-hotel-images',
              {
                hotelId: hotelData.content.id,
                listUrl: values.hotelPhotos.map(item => item.response.content),
              }
            );

            if (hotelImageData.status !== 201) {
              alert('Something went wrong when upload hotel images.');
              setLoading(false);
              actions.setSubmitting(false);
              return;
            }

            alert('Create hotel success.');
            history.push(`${SINGLE_POST_PAGE}/${hotelData.content.slug}`);
          } catch (error) {
            console.log(error);
            alert('Something went wrong.');
          }
          setLoading(false);
          actions.setSubmitting(false);
        }}
      >
        <FormStepper.Page>
          <HeaderSection>
            <Title>Step 1: Start with the basics</Title>
          </HeaderSection>

          <Row gutter={30}>
            <Col sm={12}>
              <Field
                component={AntInput}
                name="hotelName"
                type="text"
                label="Hotel Name / Title"
                validate={required}
                placeholder="Write your hotel name here"
                hasFeedback
              />
            </Col>
            <Col sm={12}>
              <Field
                component={AntInput}
                name="priceParNight"
                type="number"
                label="Price Per Night (USD)"
                validate={required}
                placeholder="$00"
                hasFeedback
              />
            </Col>
          </Row>

          <Field
            component={AntTextArea}
            name="hotelDetails"
            type="text"
            label="Hotel Description"
            validate={required}
            placeholder="Tell people about your hotel: your room, location, amenities?"
            hasFeedback
            rows={4}
          />
          <Heading
            as="h3"
            {...fieldLabel}
            content="How Many guests can your Hotel accommodate?"
          />
          <Field
            component={QuantityInput}
            name="guest"
            label="Guest Input"
            rows={4}
          />
          <Heading
            {...fieldLabel}
            as="h3"
            content="How Many beds can guests use?"
          />
          <Field
            component={QuantityInput}
            name="beds"
            label="Bed Input"
            rows={4}
          />
        </FormStepper.Page>

        <FormStepper.Page>
          <HeaderSection>
            <Title>Step 2: Hotel Photos</Title>
          </HeaderSection>

          <UploaderWrapper>
            <Field
              component={PhotoUploadComponent}
              name="hotelPhotos"
              type="file"
              label="Hotel Photos"
              validate={required}
              hasFeedback
              rows={4}
            />
          </UploaderWrapper>
        </FormStepper.Page>

        <FormStepper.Page
          validate={values => {
            console.log(values);
            const errors = {};
            if (!values.locationDescription) {
              errors.locationDescription = 'Required';
            }
            if (!values.contactNumber) {
              errors.contactNumber = 'Required';
            }
            if (!_.has(values.location, 'formattedAddress')) {
              errors.location = 'Required';
              setLocationError(true);
            } else {
              setLocationError(false);
            }
            return errors;
          }}
        >
          <HeaderSection>
            <Title>Step 3: Hotel Location</Title>
          </HeaderSection>

          <LocationWrapper>
            <Row gutter={30}>
              <Col sm={12}>
                <Field
                  component={AntInput}
                  name="contactNumber"
                  type="number"
                  label="Contact Number"
                  placeholder="Phone"
                  hasFeedback
                />
              </Col>
            </Row>

            <Field
              component={AntTextArea}
              name="locationDescription"
              type="textarea"
              label="Details description for Hotel Component"
              placeholder="Write your hotel direction in details , it may help traveler to find your hotel easily"
              hasFeedback
              rows={4}
            />
            {locationError && locationFieldBlured && (
              <Fragment>
                <Alert
                  message="Error"
                  description="Can not find this location. Please try again."
                  type="error"
                  showIcon
                />
                <br />
              </Fragment>
            )}

            <Field
              component={FormMapComponent}
              type="text"
              name="location"
              label="Choose Location"
              hasFeedback
              handleOnBlur={() => setLocationFieldBlured(true)}
            />
          </LocationWrapper>
        </FormStepper.Page>

        <FormStepper.Page>
          <AmenitiesWrapper>
            <HeaderSection>
              <Title>
                Step 4: Hotel Amenities <span> (optional)</span>
              </Title>
              <Description>
                Add your hotel amenities , it can help travelers to choose their
                perfect hotel. Thanks.
              </Description>
            </HeaderSection>
            <Row gutter={30}>
              <Col md={8}>
                <Text as="h3" {...fieldLabel} content="Wifi Availability" />
                <Field
                  name="wifiAvailability"
                  component={PorpertyType}
                  placeholder="Wifi Availability"
                />
              </Col>
              <Col md={8}>
                <Text as="h3" {...fieldLabel} content="Parking Availability" />
                <Field
                  name="parking"
                  component={Parking}
                  placeholder="Parking Availability"
                />
              </Col>

              <Col md={8}>
                <Text as="h3" {...fieldLabel} content="Pool Availability" />
                <Field
                  name="poolAvailability"
                  component={Pool}
                  placeholder="Pool Availability"
                />
              </Col>

              <Col md={8}>
                <Text as="h3" {...fieldLabel} content="Air-Conditioner" />
                <Field
                  name="airCondition"
                  component={AirCondition}
                  placeholder="Air-Conditioner"
                />
              </Col>

              <Col md={8}>
                <Text
                  as="h3"
                  {...fieldLabel}
                  content="Extra Bed Availability"
                />
                <Field
                  name="extraBed"
                  component={ExtraBed}
                  placeholder="Extra Bed Availability"
                />
              </Col>
            </Row>
          </AmenitiesWrapper>
        </FormStepper.Page>
      </FormStepper>
    </StepperWrapper>
  );
};

RenderCreateOrUpdateForm.propTypes = {
  fieldLabel: PropTypes.object,
};

RenderCreateOrUpdateForm.defaultProps = {
  fieldLabel: {
    color: '#2C2C2C',
    fontSize: '15px',
    lineHeight: '18px',
    fontWeight: '700',
    mt: ['30px', '47px'],
    mb: ['15px', '30px'],
  },
};

export default RenderCreateOrUpdateForm;
