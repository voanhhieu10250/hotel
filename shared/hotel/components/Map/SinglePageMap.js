import React from 'react';
import { Marker } from 'react-google-maps';
import HotelInfoWindow from './MapInfoWindow';
import MakerImage from './hotelMapMarker.png';

const SingleMapDisplay = props => {
  let locationArray = [];
  const { location, infoWindowToggle, isOpen, markerIndex } = props;
  console.log(location);
  locationArray.push({
    lat: location && location.lat,
    lng: location && location.lng,
    id: location && location.id,
    title: location && location.title,
    thumbUrl:
      location && location.images.length > 0
        ? location.images[0].url
        : '/placeholder/hotel_thumb.jpg',
    formattedAddress: location && location.formattedAddress,
    price: location && location.price,
    rating: location && location.rating,
    ratingCount: location && location.ratingCount,
  });

  return locationArray.map((singlePostLoaction, index) => {
    return (
      <Marker
        key={index}
        icon={MakerImage}
        position={singlePostLoaction}
        onClick={() => {
          infoWindowToggle(singlePostLoaction.id);
        }}
      >
        {isOpen && markerIndex === singlePostLoaction.id ? (
          <HotelInfoWindow
            postData={singlePostLoaction}
            onCloseClick={() => {
              infoWindowToggle(singlePostLoaction.id);
            }}
          />
        ) : (
          ''
        )}
      </Marker>
    );
  });
};

const HotelMapMarkerSingle = props => {
  return <SingleMapDisplay {...props} />;
};

export default HotelMapMarkerSingle;
