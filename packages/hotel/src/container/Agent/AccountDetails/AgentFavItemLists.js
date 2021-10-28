import React, { useState } from 'react';
import SectionGrid from '@hotel/components/SectionGrid/SectionGrid.cra';
import { HotelPostGridLoader } from '@iso/ui/ContentLoader/ContentLoader';
import { SINGLE_POST_PAGE } from '../../../settings/constant';

const AgentFavItemLists = ({ data, loading }) => {
  const [limit, setLimit] = useState(6);
  const favourite_post = data.favouritePost.slice(0, limit);

  return (
    <SectionGrid
      link={SINGLE_POST_PAGE}
      data={favourite_post}
      loading={loading}
      limit={6}
      totalItem={data.favouritePost.length}
      columnWidth={[1 / 2, 1 / 2, 1 / 3, 1 / 4, 1 / 5, 1 / 6]}
      placeholder={<HotelPostGridLoader />}
      handleLoadMore={() => setLimit(limit + 8)}
    />
  );
};

export default AgentFavItemLists;
