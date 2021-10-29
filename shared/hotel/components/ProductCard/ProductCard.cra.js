import React, { useContext, useState } from 'react';
import TextLink from '@iso/ui/TextLink/TextLink';
import Rating from '@iso/ui/Rating/Rating';
import Favourite from '@iso/ui/Favorite/Favorite';
import Carousel from 'react-multi-carousel';
import { useHistory } from 'react-router-dom';
import { find } from 'lodash';
import 'react-multi-carousel/lib/styles.css';
import GridCard from '../GridCard/GridCard';
import {
  apiInstance,
  AuthContext,
} from '../../../../packages/hotel/src/context/AuthProvider';
import { LOGIN_PAGE } from '../../../../packages/hotel/src/settings/constant';

const responsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024,
    },
    items: 1,
    paritialVisibilityGutter: 40,
  },
  mobile: {
    breakpoint: {
      max: 464,
      min: 0,
    },
    items: 1,
    paritialVisibilityGutter: 30,
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 464,
    },
    items: 1,
    paritialVisibilityGutter: 30,
  },
};

const PostGrid = ({
  title,
  rating,
  location,
  price,
  ratingCount,
  images,
  slug,
  link,
  agent,
  id,
}) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const isOwnPost = user && user.id === agent.id;

  const alreadyInFavourite =
    user && find(user.favouritePost, { id: id }) ? true : false;

  const handleAddHotelToFavourite = async event => {
    if (!user) history.push(LOGIN_PAGE);
    if (loading) return;
    // console.log(event);
    setLoading(true);
    try {
      if (!event) {
        // if event === false => not add yet

        const { data } = await apiInstance.post('user/add-favourite-hotel', {
          hotelId: id,
        });
        if (data.status === 200)
          console.log('add hotel to favourite list successfully.');
      } else {
        // if event === true => already added

        const { data } = await apiInstance.post('user/remove-favourite-hotel', {
          hotelId: id,
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
    <GridCard
      isCarousel={true}
      favorite={
        !isOwnPost && (
          <Favourite
            onClick={handleAddHotelToFavourite}
            alreadyInFavourite={alreadyInFavourite}
          />
        )
      }
      location={location.formattedAddress}
      title={<TextLink link={`${link}/${slug}`} content={title} />}
      price={`$${price}/Night - Free Cancellation`}
      rating={<Rating rating={rating} ratingCount={ratingCount} type="bulk" />}
      viewDetailsBtn={
        <TextLink link={`${link}/${slug}`} content="View Details" />
      }
    >
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        containerClass="container"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        renderDotsOutside={false}
        responsive={responsive}
        showDots={true}
        sliderClass=""
        slidesToSlide={1}
      >
        {images.length > 0 ? (
          images.map(({ url }, index) => (
            <img
              src={url}
              alt={url}
              key={index}
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'relative',
              }}
            />
          ))
        ) : (
          <img
            src="/placeholder/hotel.jpg"
            alt="/placeholder/hotel.jpg"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'relative',
            }}
          />
        )}
      </Carousel>
    </GridCard>
  );
};

export default PostGrid;
