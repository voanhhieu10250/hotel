import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Divider from '@iso/ui/Antd/Divider/Divider';
import Logo from '@iso/ui/Logo/Logo';
import SignInForm from './SignInForm';
import { REGISTRATION_PAGE } from '../../settings/constant';
import SignInWrapper, {
  Title,
  TitleInfo,
  Text,
  SignInFormWrapper,
  SignInBannerWrapper,
} from './SignIn.style';

import signInImage from '@hotel/assets/images/airbnb-banner.jpg';
import DemoLogo from '@hotel/assets/images/logo-with-text.svg';
import { AuthContext } from '../../context/AuthProvider';

const SignIn = () => {
  const { loading } = useContext(AuthContext);
  return (
    <SignInWrapper $loading={loading}>
      <SignInFormWrapper>
        <Logo withLink linkTo="/" src={DemoLogo} title="Hotel Logo" />
        <Title>Welcome Back</Title>
        <TitleInfo>Please Log in to your account</TitleInfo>
        <SignInForm />
        <Divider />

        <Text>
          Don't Have an Account?{' '}
          <Link to={REGISTRATION_PAGE}>Registration</Link>
        </Text>
      </SignInFormWrapper>

      <SignInBannerWrapper>
        <div
          style={{
            backgroundImage: `url(${signInImage})`,
            backgroundPosition: 'center center',
            height: '100vh',
            backgroundSize: 'cover',
          }}
        />
      </SignInBannerWrapper>
    </SignInWrapper>
  );
};

export default SignIn;
