import React, { Fragment } from 'react';
import useWindowSize from './useWindowSize';
import StickyBookingWrapper, {
  HotelInfo,
  InfoArea,
  Title,
  Logo,
  HotelAction,
  Price,
  ActionBtn,
  HotelRating,
} from './StickyBooking.style';

const StickyBooking = ({ logo, title, price, rating, action, className }) => {
  const textPrice = price && !isNaN(Number(price)) ? price : '162';
  // Add all classs to an array
  const addAllClasses = ['sticky_booking'];

  // className prop checking
  if (className) {
    addAllClasses.push(className);
  }

  // useWindowSize hook
  const windowSize = process.browser && useWindowSize();
  const windowInnerWidth = process.browser && windowSize.innerWidth;

  return (
    <StickyBookingWrapper className={addAllClasses.join(' ')}>
      <HotelInfo className="hotel_info">
        {windowInnerWidth > 767 && (
          <Fragment>{logo && <Logo src={logo} alt={title} />}</Fragment>
        )}

        {title || rating || textPrice ? (
          <InfoArea>
            {windowInnerWidth > 767 ? (
              <Fragment>{title && <Title>{title}</Title>}</Fragment>
            ) : (
              <Price>
                <span>${textPrice}</span> / Night
              </Price>
            )}
            {rating && <HotelRating>{rating}</HotelRating>}
          </InfoArea>
        ) : (
          ''
        )}
      </HotelInfo>

      <HotelAction className="hotel_action">
        {windowInnerWidth > 767 && (
          <Price>
            <span>${textPrice}</span> / Night
          </Price>
        )}
        <ActionBtn>{action}</ActionBtn>
      </HotelAction>
    </StickyBookingWrapper>
  );
};

export default StickyBooking;
