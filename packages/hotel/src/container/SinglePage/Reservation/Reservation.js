import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Card from '@iso/ui/UI/Card/Card';
import Heading from '@iso/ui/Heading/Heading';
import Text from '@iso/ui/Text/Text';
import TextLink from '@iso/ui/TextLink/TextLink';
import RenderReservationForm from './RenderReservationForm';
import { PRICING_PLAN_PAGE } from '../../../settings/constant';

const CardHeader = ({
  priceStyle,
  pricePeriodStyle,
  linkStyle,
  price,
  agentId,
}) => {
  const textPrice = price && !isNaN(Number(price)) ? price : '162';

  return (
    <Fragment>
      <Heading
        content={
          <Fragment>
            ${textPrice}{' '}
            <Text as="span" content="/ night" {...pricePeriodStyle} />
          </Fragment>
        }
        {...priceStyle}
      />
      <TextLink
        link={`/profile/${agentId}/contact`}
        content="Contact Agent"
        {...linkStyle}
      />
    </Fragment>
  );
};

export default function Reservation({ price, agentId, hotelId }) {
  return (
    <Card
      className="reservation_sidebar"
      header={<CardHeader price={price} agentId={agentId} />}
      content={<RenderReservationForm hotelId={hotelId} />}
      footer={
        <p>
          Special offers available.{' '}
          <TextLink to={PRICING_PLAN_PAGE} content="See details" />
        </p>
      }
    />
  );
}

CardHeader.propTypes = {
  priceStyle: PropTypes.object,
  pricePeriodStyle: PropTypes.object,
  linkStyle: PropTypes.object,
};

CardHeader.defaultProps = {
  priceStyle: {
    color: '#2C2C2C',
    fontSize: '25px',
    fontWeight: '700',
  },
  pricePeriodStyle: {
    fontSize: '15px',
    fontWeight: '400',
  },
  linkStyle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#008489',
  },
};
