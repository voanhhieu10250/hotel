import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Divider from '@iso/ui/Antd/Divider/Divider';
import Logo from '@iso/ui/Logo/Logo';
import SignUpForm from './SignUpForm';
import signUpImage from '@hotel/assets/images/airbnb-banner.jpg';
import DemoLogo from '@hotel/assets/images/logo-with-text.svg';
import SignUpWrapper, {
  Title,
  TitleInfo,
  Text,
  SignUpFormWrapper,
  SignUpBannerWrapper,
} from './SignUp.style';

import { LOGIN_PAGE } from '../../settings/constant';
import { AuthContext } from '../../context/AuthProvider';

export default function SignUp() {
  const { loading } = useContext(AuthContext);
  return (
    <SignUpWrapper $loading={loading}>
      <SignUpFormWrapper>
        <Logo withLink linkTo="/" src={DemoLogo} title="Hotel Logo" />
        <Title>Welcome To TripFinder</Title>
        <TitleInfo>Please Register for your account</TitleInfo>
        <SignUpForm />
        <Divider />

        <Text>
          Already Have an Account! <Link to={LOGIN_PAGE}>Login</Link>
        </Text>
      </SignUpFormWrapper>

      <SignUpBannerWrapper>
        <div
          style={{
            backgroundImage: `url(${signUpImage})`,
            backgroundPosition: 'center center',
            height: '100vh',
            backgroundSize: 'cover',
          }}
        />
      </SignUpBannerWrapper>
    </SignUpWrapper>
  );
}
