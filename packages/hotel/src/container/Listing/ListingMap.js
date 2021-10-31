import React from 'react';
import isEmpty from 'lodash/isEmpty';
import Map, { MapDataProcessing } from '@hotel/components/Map/Map';
import { FixedMap } from './Listing.style';

const ListingMap = ({ data, loading }) => {
  if (isEmpty(data) || loading) return <div>Loading</div>;

  return (
    <FixedMap>
      <Map>
        <MapDataProcessing
          location={data?.content?.records.map(
            ({ title, images, price, rating, ratingCount, location }) => ({
              ...location,
              title,
              images,
              price,
              rating,
              ratingCount,
            })
          )}
          multiple={true}
        />
      </Map>
    </FixedMap>
  );
};

export default ListingMap;
