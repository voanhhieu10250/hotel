import React, { useContext, Fragment } from 'react';
import { Route, NavLink, Redirect, Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import {
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoInstagram,
  IoIosAdd,
} from 'react-icons/io';
import Menu from '@iso/ui/Antd/Menu/Menu';
import Popover from '@iso/ui/Antd/Popover/Popover';
import Container from '@iso/ui/UI/Container/Container';
import Image from '@iso/ui/Image/Image';
import Heading from '@iso/ui/Heading/Heading';
import Text from '@iso/ui/Text/Text';
import { ProfilePicLoader } from '@iso/ui/ContentLoader/ContentLoader';
import Loader from '@hotel/components/Loader/Loader';
import AgentItemLists from './AgentItemLists';
import AgentFavItemLists from './AgentFavItemLists';
import AgentContact from './AgentContact';
import {
  ADD_HOTEL_PAGE,
  AGENT_PROFILE_FAVOURITE,
  AGENT_PROFILE_CONTACT,
  HOME_PAGE,
} from '../../../settings/constant';
import AgentDetailsPage, {
  BannerSection,
  UserInfoArea,
  ProfileImage,
  ProfileInformationArea,
  ProfileInformation,
  SocialAccount,
  NavigationArea,
} from './AgentDetails.style';
import { AuthContext } from '../../../context/AuthProvider';
import useDataApi from '../../../../../../shared/common/library/hooks/useDataApi';

const ProfileNavigation = props => {
  const { match, className } = props;

  return (
    <NavigationArea>
      <Menu className={className}>
        <Menu.Item key="0">
          <NavLink exact to={`${match.url}`}>
            Listing
          </NavLink>
        </Menu.Item>
        <Menu.Item key="1">
          <NavLink to={`${match.url}${AGENT_PROFILE_FAVOURITE}`}>
            Favourite
          </NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to={`${match.url}${AGENT_PROFILE_CONTACT}`}>Contact</NavLink>
        </Menu.Item>
      </Menu>

      <Link className="add_card" to={ADD_HOTEL_PAGE}>
        <IoIosAdd /> Add Hotel
      </Link>
    </NavigationArea>
  );
};

const ProfileRoute = props => {
  const { match } = props;
  console.log(match);
  return (
    <Container fluid={true}>
      <Route exact path={`${match.path}`} component={AgentItemLists} />
      <Route
        path={`${match.path}${AGENT_PROFILE_FAVOURITE}`}
        component={AgentFavItemLists}
      />
      <Route
        path={`${match.path}${AGENT_PROFILE_CONTACT}`}
        component={AgentContact}
      />
    </Container>
  );
};

const AgentProfileInfo = ({ user, loading }) => {
  // lưu ý, đây chỉ là đang xem acc của chính bản thân. Phải xét trường hợp đang xem acc ng` khác nữa. xài useDataApi
  if (isEmpty(user) || loading) return <Loader />;
  const {
    firstName,
    lastName,
    content,
    profilePic,
    coverPic,
    twitter,
    facebook,
    instagram,
  } = user;

  const username = `${firstName} ${lastName}`;

  return (
    <Fragment>
      <BannerSection
        style={{
          background: `url(${coverPic?.url ||
            '/placeholder/coverpic.png'}) center center / cover no-repeat`,
        }}
      />
      <UserInfoArea>
        <Container fluid={true}>
          <ProfileImage>
            {profilePic ? (
              <Image src={profilePic.url} alt="Profile Pic" />
            ) : (
              <ProfilePicLoader />
            )}
          </ProfileImage>
          <ProfileInformationArea>
            <ProfileInformation>
              <Heading content={username} />
              <Text content={content} />
            </ProfileInformation>
            <SocialAccount>
              <Popover content="Twitter">
                <a href={twitter} target="_blank" rel="noopener noreferrer">
                  <IoLogoTwitter className="twitter" />
                </a>
              </Popover>
              <Popover content="Facebook">
                <a href={facebook} target="_blank" rel="noopener noreferrer">
                  <IoLogoFacebook className="facebook" />
                </a>
              </Popover>
              <Popover content="Instagram">
                <a href={instagram} target="_blank" rel="noopener noreferrer">
                  <IoLogoInstagram className="instagram" />
                </a>
              </Popover>
            </SocialAccount>
          </ProfileInformationArea>
        </Container>
      </UserInfoArea>
    </Fragment>
  );
};

export default function AgentDetailsViewPage(props) {
  const { loggedIn, user, loading } = useContext(AuthContext);

  // Check nếu user chưa logged in hoặc param id ko bằng current user id thì xài data lấy từ useDataApi
  // đồng nghĩa với: khi user đã logged in và đang cự coi profile của bản thân thì ko cần xài useDataApi, còn lại là xài useDataApi

  // useDataApi("")

  return (
    <AgentDetailsPage>
      <AgentProfileInfo user={user} loading={loading} />
      <Fragment>
        <ProfileNavigation {...props} />
        <ProfileRoute {...props} />
      </Fragment>
    </AgentDetailsPage>
  );
}
