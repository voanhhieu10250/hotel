import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import ImageGalleryWrapper from './ImageGallery.style';

// import PostImage1 from "@hotel/assets/images/post-image-1.jpg";
import PostImage2 from '@hotel/assets/images/post-image-2.jpg';
// import PostThumb1 from "@hotel/assets/images/post-thumb-1.jpg";
import PostThumb2 from '@hotel/assets/images/post-thumb-2.jpg';

// const images = [
//   {
//     original: PostImage2,
//     thumbnail: PostThumb2,
//   },
// ];

const PostImageGallery = ({ images }) => {
  const imageList =
    images.length > 0
      ? images.map(item => {
          return {
            original: item.url,
            thumbnail: item.url,
          };
        })
      : [
          {
            original: PostImage2,
            thumbnail: PostThumb2,
          },
        ];

  return (
    <ImageGalleryWrapper>
      <ImageGallery
        items={imageList}
        showPlayButton={false}
        showFullscreenButton={false}
        showIndex={true}
        lazyLoad={true}
        slideDuration={550}
      />
    </ImageGalleryWrapper>
  );
};

export default PostImageGallery;
