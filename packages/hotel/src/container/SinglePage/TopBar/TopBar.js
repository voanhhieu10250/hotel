import React, { useContext, useState } from 'react';
import Sticky from 'react-stickynode';
import {
  FaceBookShare,
  TwitterShare,
  LinkedInShare,
  PinterestShare,
} from '@hotel/components/SocialShare/SocialShare';
import Button from '@iso/ui/Antd/Button/Button';
import Menu from '@iso/ui/Antd/Menu/Menu';
import Dropdown from '@iso/ui/Antd/Dropdown/Dropdown';
import Favorite from '@iso/ui/Favorite/Favorite';
import ScrollBar from '@iso/ui/UI/ScrollBar/ScrollBar';
import { TobBarWrapper, ButtonGroup } from '../SinglePageView.style';
import { apiInstance, AuthContext } from '../../../context/AuthProvider';
import { useHistory } from 'react-router';
import { LOGIN_PAGE } from '../../../settings/constant';
import { find } from 'lodash';

const topBarMenu = [
  {
    name: 'Overview',
    target: 'overview',
  },
  {
    name: 'Amenities',
    target: 'amenities',
  },
  {
    name: 'Location',
    target: 'location',
  },
  {
    name: 'Reviews',
    target: 'reviews',
  },
];

const SocialShareMenu = props => {
  return (
    <Menu>
      <Menu.Item>
        <TwitterShare {...props} />
      </Menu.Item>
      <Menu.Item>
        <FaceBookShare {...props} />
      </Menu.Item>
      <Menu.Item>
        <LinkedInShare {...props} />
      </Menu.Item>
      <Menu.Item>
        <PinterestShare {...props} />
      </Menu.Item>
    </Menu>
  );
};

const SideButtons = props => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { user, loggedIn } = useContext(AuthContext);
  const alreadyInFavourite =
    user && find(user.favouritePost, { id: props.hotelId }) ? true : false;
  const isLoggedIn = loggedIn && user;

  const handleAddHotelToFavourite = async event => {
    if (!user) history.push(LOGIN_PAGE);
    if (loading) return;
    // console.log(event);
    setLoading(true);
    try {
      if (event) {
        // if event === false => not add yet

        const { data } = await apiInstance.post('user/add-favourite-hotel', {
          hotelId: props.hotelId,
        });
        if (data.status === 200)
          console.log('add hotel to favourite list successfully.');
      } else {
        // if event === true => already added

        const { data } = await apiInstance.post('user/remove-favourite-hotel', {
          hotelId: props.hotelId,
        });
        if (data.status === 200)
          console.log('remove hotel from favourite list successfully.');
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <ButtonGroup>
      {isLoggedIn && props.author.id !== user.id && (
        <Favorite
          className="ant-btn"
          content="Save"
          alreadyInFavourite={alreadyInFavourite}
          onClick={handleAddHotelToFavourite}
        />
      )}
      <Dropdown
        placement="bottomRight"
        overlay={() => <SocialShareMenu {...props} />}
        overlayClassName="social_share_menu"
      >
        <Button className="ant-dropdown-link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.309 15.537">
            <path
              d="M80.68,101.873,74.507,96.1a.316.316,0,0,0-.245-.105c-.193.009-.438.144-.438.35v2.9a.187.187,0,0,1-.158.179c-6.138.941-8.724,5.535-9.639,10.3-.035.188.219.363.337.214a11.158,11.158,0,0,1,9.275-4.7.216.216,0,0,1,.184.21v2.844a.375.375,0,0,0,.634.232l6.217-5.876a.483.483,0,0,0,.153-.368A.586.586,0,0,0,80.68,101.873Z"
              transform="translate(-63.271 -95.242)"
            />
          </svg>
          Share
        </Button>
      </Dropdown>
    </ButtonGroup>
  );
};

const TopBar = props => {
  const { title, shareURL, author, media, hotelId } = props;
  return (
    <TobBarWrapper>
      <Sticky innerZ={9999} top={82} activeClass="isSticky">
        <ScrollBar
          menu={topBarMenu}
          other={
            <SideButtons
              media={media}
              author={author}
              title={title}
              shareURL={shareURL}
              hotelId={hotelId}
            />
          }
        />
      </Sticky>
    </TobBarWrapper>
  );
};

export default TopBar;
