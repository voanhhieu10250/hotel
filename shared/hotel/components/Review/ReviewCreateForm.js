import React, { useState, useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import RenderReviewForm from './RenderReviewForm';
import {
  apiInstance,
  AuthContext,
} from '../../../../packages/hotel/src/context/AuthProvider';

const initialValues = {
  reviewTitle: '',
  reviewDetails: '',
  tripType: '',
  travelTime: '',
  ratings: 5,
  roomsRatings: 5,
  serviceRatings: 5,
  cleanlinessRatings: 5,
  foodRatings: 5,
  tips: '',
  termsAndCondition: false,
  quant: '',
  roomViews: '',
  indoorPool: '',
  isTrendy: '',
  isRomantic: '',
};

const ReviewValidationSchema = () => {
  return Yup.object().shape({
    reviewTitle: Yup.string().required('Title is Required!'),
    reviewDetails: Yup.string().required('Details is Required!'),
    tripType: Yup.string().required('Trip Type is Required!'),
    ratings: Yup.number().required('Rating  is Required!'),
    roomsRatings: Yup.number().required('Room rating is Required!'),
    serviceRatings: Yup.number().required('Service rating is Required!'),
    cleanlinessRatings: Yup.number().required('Cleanness rating is Required!'),
    foodRatings: Yup.number().required('Food rating is Required!'),
    termsAndCondition: Yup.boolean().required(
      'Terms and condition acceptence  is Required!'
    ),
    quant: Yup.string()
      .oneOf(['yes', 'no', 'not-sure'])
      .required('Please select this information'),
    roomViews: Yup.string()
      .oneOf(['yes', 'no', 'not-sure'])
      .required('Please select this information'),
    indoorPool: Yup.string()
      .oneOf(['yes', 'no', 'not-sure'])
      .required('Please select this information'),
    isTrendy: Yup.string()
      .oneOf(['yes', 'no', 'not-sure'])
      .required('Please select this information'),
    isRomantic: Yup.string()
      .oneOf(['yes', 'no', 'not-sure'])
      .required('Please select this information'),
  });
};

export default ({ hotelId }) => {
  const { user, loggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async formProps => {
    if (!loggedIn || !user) {
      alert('Please signin first then do the booking later !');
      return;
    }
    if (loading) return;
    const {
      reviewTitle,
      reviewDetails,
      roomsRatings,
      serviceRatings,
      cleanlinessRatings,
      foodRatings,
    } = formProps;

    setLoading(true);
    try {
      const { data } = await apiInstance.post('review/create-new-review', {
        cleannessRating: cleanlinessRatings,
        foodRating: foodRatings,
        hotelId: hotelId,
        roomRating: roomsRatings,
        serviceRating: serviceRatings,
        text: reviewDetails,
        title: reviewTitle,
      });
      console.log(data);
      if (data.status === 201) {
        alert('Review success !');
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      alert('Something went wrong. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={props => <RenderReviewForm {...props} loading={loading} />}
      validationSchema={ReviewValidationSchema}
    />
  );
};
