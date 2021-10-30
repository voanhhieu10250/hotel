import React from 'react';
import { Popover } from 'antd';
import moment from 'moment';
import LikeDislike from './LikeDislike';
import Rating from '../Rating/Rating';

export default class App extends React.Component {
  render() {
    const { singleReview, authorRating } = this.props;
    const reviewAuthorFirstName = singleReview
      ? singleReview.author.firstName
      : '';
    const reviewAuthorLastName = singleReview
      ? singleReview.author.lastName
      : '';
    const authorName = reviewAuthorFirstName + ' ' + reviewAuthorLastName;
    const content = singleReview ? singleReview.text : '';
    const reviewTitle = singleReview ? singleReview.title : '';
    const commentDate = singleReview ? singleReview.reviewDate : '';
    const postTime = new Date(commentDate).getTime();
    const authorAvatar =
      singleReview && singleReview.author.profilePic
        ? singleReview.author.profilePic.url
        : '/placeholder/profilepic.png';

    return (
      <div className="comment-area">
        <div className="comment-wrapper">
          <div className="comment-header">
            <div className="avatar-area">
              <div className="author-avatar">
                <img src={authorAvatar} alt={authorName} />
              </div>
              <div className="author-info">
                <h3 className="author-name">{authorName}</h3>
                {authorRating && (
                  <div className="author-rating">{authorRating}</div>
                )}
                <div className="comment-date">
                  <Popover
                    placement="bottom"
                    content={moment(commentDate).format(
                      'dddd, MMMM Do YYYY, h:mm:ss a'
                    )}
                  >
                    <span>Reviewed - {moment(postTime).fromNow()}</span>
                  </Popover>
                </div>
              </div>
            </div>
            <div className="rating-area">
              <LikeDislike />
            </div>
          </div>
          <div className="comment-body">
            <h4>{reviewTitle}</h4>
            <p>{content}</p>
          </div>
          <div className="comment-rating">
            <div className="rating-widget">
              <Rating
                rating={singleReview.serviceRating}
                ratingFieldName="Service"
                type="individual"
              />
            </div>
            <div className="rating-widget">
              <Rating
                rating={singleReview.roomRating}
                ratingFieldName="Room"
                type="individual"
              />
            </div>
            <div className="rating-widget">
              <Rating
                rating={singleReview.cleannessRating}
                ratingFieldName="Cleanness"
                type="individual"
              />
            </div>
            <div className="rating-widget">
              <Rating
                rating={singleReview.foodRating}
                ratingFieldName="Food"
                type="individual"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
