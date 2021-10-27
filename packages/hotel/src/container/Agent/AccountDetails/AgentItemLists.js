import React, { useContext, useState } from 'react';
import SectionGrid from '@hotel/components/SectionGrid/SectionGrid.cra';
import { HotelPostGridLoader } from '@iso/ui/ContentLoader/ContentLoader';
import { SINGLE_POST_PAGE } from '../../../settings/constant';
import { AuthContext } from '../../../context/AuthProvider';

const AgentItemLists = () => {
  const { user, loading } = useContext(AuthContext);
  const [limit, setLimit] = useState(8);
  const listed_post = user.listedPost.slice(0, limit);

  // lưu ý, đây chỉ là đang xem acc của chính bản thân. Phải xét trường hợp đang xem acc ng` khác nữa

  return (
    <SectionGrid
      link={SINGLE_POST_PAGE}
      data={listed_post}
      loading={loading}
      limit={limit}
      totalItem={user.listedPost.length}
      columnWidth={[1 / 2, 1 / 2, 1 / 3, 1 / 4, 1 / 5, 1 / 6]}
      placeholder={<HotelPostGridLoader />}
      handleLoadMore={() => setLimit(limit + 8)}
    />
  );
};

export default AgentItemLists;
