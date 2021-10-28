import React, { useContext, Fragment } from 'react';
import { Route, NavLink, Redirect, Link, useParams } from 'react-router-dom';
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
import useDataApi from '@iso/lib/hooks/useDataApi';

const ProfileNavigation = props => {
  const { match, className } = props;
  const { user } = useContext(AuthContext);

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
      {user && user.id === Number(match.params.id) && (
        <Link className="add_card" to={ADD_HOTEL_PAGE}>
          <IoIosAdd /> Add Hotel
        </Link>
      )}
    </NavigationArea>
  );
};

const ProfileRoute = props => {
  const { match, data, loading } = props;

  return (
    <Container fluid={true}>
      <Route
        exact
        path={`${match.path}`}
        render={props => (
          <AgentItemLists {...props} data={data} loading={loading} />
        )}
      />
      <Route
        path={`${match.path}${AGENT_PROFILE_FAVOURITE}`}
        render={props => (
          <AgentFavItemLists {...props} data={data} loading={loading} />
        )}
      />
      <Route
        path={`${match.path}${AGENT_PROFILE_CONTACT}`}
        render={props => (
          <AgentContact {...props} data={data} loading={loading} />
        )}
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
  const { id } = useParams();
  const { data, loading, error } = useDataApi(`user/get-user-details/${id}`);
  console.log(data);
  // Check nếu user chưa logged in hoặc param id ko bằng current user id thì xài data lấy từ useDataApi
  // đồng nghĩa với: khi user đã logged in và đang cự coi profile của bản thân thì ko cần xài useDataApi, còn lại là xài useDataApi

  if (!data && !error)
    return (
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        Progressing...
      </div>
    );
  if (error && !loading) return <Redirect to="/404" />;

  return (
    <AgentDetailsPage>
      <AgentProfileInfo user={data.content} loading={loading} />
      <Fragment>
        <ProfileNavigation {...props} />
        <ProfileRoute {...props} data={data.content} loading={loading} />
      </Fragment>
    </AgentDetailsPage>
  );
}
