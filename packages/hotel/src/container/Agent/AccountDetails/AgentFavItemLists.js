import React, { useContext, useState } from 'react';
import SectionGrid from '@hotel/components/SectionGrid/SectionGrid.cra';
import { HotelPostGridLoader } from '@iso/ui/ContentLoader/ContentLoader';
import { SINGLE_POST_PAGE } from '../../../settings/constant';
import { AuthContext } from '../../../context/AuthProvider';

const AgentFavItemLists = () => {
  const { user, loading } = useContext(AuthContext);
  const [limit, setLimit] = useState(6);
  const favourite_post = user.favouritePost.slice(0, limit);
  // lưu ý, đây chỉ là đang xem acc của chính bản thân. Phải xét trường hợp đang xem acc ng` khác nữa
  return (
    <SectionGrid
      link={SINGLE_POST_PAGE}
      data={favourite_post}
      loading={loading}
      limit={6}
      totalItem={user.favouritePost.length}
      columnWidth={[1 / 2, 1 / 2, 1 / 3, 1 / 4, 1 / 5, 1 / 6]}
      placeholder={<HotelPostGridLoader />}
      handleLoadMore={() => setLimit(limit + 8)}
    />
  );
};

export default AgentFavItemLists;
