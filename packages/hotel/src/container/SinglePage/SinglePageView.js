import React, { Fragment, useState } from 'react';
import { useLocation } from '@iso/lib/hooks/useLocation';
import Sticky from 'react-stickynode';
import Row from '@iso/ui/Antd/Grid/Row';
import Col from '@iso/ui/Antd/Grid/Col';
import Modal from '@iso/ui/Antd/Modal/Modal';
import Button from '@iso/ui/Antd/Button/Button';
import Container from '@iso/ui/UI/Container/Container';
import Loader from '@hotel/components/Loader/Loader';
import useWindowSize from '@iso/lib/hooks/useWindowSize';
import Description from './Description/Description';
import Amenities from './Amenities/Amenities';
import Location from './Location/Location';
import Review from './Review/Review';
import Reservation from './Reservation/Reservation';
import BottomReservation from './Reservation/BottomReservation';
import TopBar from './TopBar/TopBar';
import SinglePageWrapper, { PostImage } from './SinglePageView.style';
import PostImageGallery from './ImageGallery/ImageGallery';
import useDataApi from '@iso/lib/hooks/useDataApi';
import singlePostBgImg from '@hotel/assets/images/single-post-bg.jpg';
import { Redirect } from 'react-router';
// import { apiInstance } from "../../context/AuthProvider";

const SinglePage = ({ match }) => {
  const { href } = useLocation();
  const [isModalShowing, setIsModalShowing] = useState(false);
  // useWindowSize hook
  const { width } = useWindowSize();

  // let url = "/data/hotel-single.json";

  // const fetchHotelDetail = async () => {
  //   try {
  //     const { data } = await apiInstance.get(`/hotel/${match.params.slug}}`);
  //     console.log(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  console.log(match.params.slug);
  const { data, loading, error } = useDataApi(`hotel/${match.params.slug}`);
  if ((!data && loading) || (!data && !error && !loading)) return <Loader />;
  if ((!data || !data.content) && !loading) return <Redirect to="/404" />;

  console.log(data);
  const {
    reviews,
    rating,
    ratingCount,
    price,
    title,
    images,
    location,
    content,
    amenities,
    agent,
    id,
    coverPic,
  } = data.content;

  return (
    <SinglePageWrapper>
      <PostImage
        bgImage={
          coverPic
            ? coverPic.url
            : images.length > 0
            ? images[0].url
            : singlePostBgImg
        }
      >
        <Button
          type="primary"
          onClick={() => setIsModalShowing(true)}
          className="image_gallery_button"
        >
          View Photos
        </Button>
        <Modal
          visible={isModalShowing}
          onCancel={() => setIsModalShowing(false)}
          footer={null}
          width="100%"
          maskStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
          wrapClassName="image_gallery_modal"
          closable={false}
        >
          <Fragment>
            <PostImageGallery images={images} />
            <Button
              onClick={() => setIsModalShowing(false)}
              className="image_gallery_close"
            >
              <svg width="16.004" height="16" viewBox="0 0 16.004 16">
                <path
                  id="_ionicons_svg_ios-close_2_"
                  d="M170.4,168.55l5.716-5.716a1.339,1.339,0,1,0-1.894-1.894l-5.716,5.716-5.716-5.716a1.339,1.339,0,1,0-1.894,1.894l5.716,5.716-5.716,5.716a1.339,1.339,0,0,0,1.894,1.894l5.716-5.716,5.716,5.716a1.339,1.339,0,0,0,1.894-1.894Z"
                  transform="translate(-160.5 -160.55)"
                  fill="#909090"
                />
              </svg>
            </Button>
          </Fragment>
        </Modal>
      </PostImage>

      <TopBar
        title={title}
        shareURL={href}
        author={agent}
        media={images}
        hotelId={id}
      />

      <Container>
        <Row gutter={30} id="reviewSection" style={{ marginTop: 30 }}>
          <Col xl={16}>
            <Description
              content={content}
              title={title}
              location={location}
              rating={rating}
              ratingCount={ratingCount}
            />
            <Amenities amenities={amenities} />
            <Location
              location={{
                ...location,
                title,
                images,
                price,
                rating,
                ratingCount,
              }}
            />
          </Col>
          <Col xl={8}>
            {width > 1200 ? (
              <Sticky
                innerZ={999}
                activeClass="isSticky"
                top={202}
                bottomBoundary="#reviewSection"
              >
                <Reservation price={price} agentId={agent.id} hotelId={id} />
              </Sticky>
            ) : (
              <BottomReservation
                title={title}
                price={price}
                rating={rating}
                ratingCount={ratingCount}
                agentId={agent.id}
                hotelId={id}
              />
            )}
          </Col>
        </Row>
        <Row gutter={30}>
          <Col xl={16}>
            <Review
              reviews={reviews}
              ratingCount={ratingCount}
              rating={rating}
              hotelId={id}
            />
          </Col>
          <Col xl={8} />
        </Row>
      </Container>
    </SinglePageWrapper>
  );
};

export default SinglePage;
