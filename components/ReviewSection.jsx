import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Rating from 'react-rating-stars-component';
// import ProfileImage from "@assets/img/actors/actors-image";
import ReactReadMoreReadLess from 'react-read-more-read-less';

const ReviewSection = (props) => {
    const { reviewList } = props;
    const [reviews, setReviewList] = useState([]);

    useEffect(() => {
        setReviewList(reviewList);
    }, [reviewList]);

    return (
        <div className="review-sec container py-5">
            <div className="row g-4">
                <div className="col-lg-12">
                    <div className="review-box  ">
                        {reviews?.map((review, index) => {
                            return (
                                <div key={index} className="mb-4 bg-[#e09a7a1a] shadow-sm rounded-lg  p-4 mb-3">
                                    <div className="align-items-center mb-2 flex">
                                        <img src={review.user?.avatar ? review.user?.avatar : '/assets/images/user.png'} alt="avatar" className="rounded-circle me-2" width={50} />
                                        <div>
                                            <strong>{`${review.user?.firstName} ${review.user?.lastName}`}</strong>
                                            {review.created_at && <p className="text-muted small m-0">{moment(review.created_at)?.format('DD-MM-YYYY')}</p>}
                                        </div>
                                    </div>
                                    <ReactReadMoreReadLess
                                        charLimit={150}
                                        readMoreText={'Read more '}
                                        readLessText={'Read less '}
                                        readMoreClassName={'text-[#b4633a] underline'}
                                        readLessClassName={'text-[#b4633a] underline'}
                                    >
                                        {review.comment}
                                    </ReactReadMoreReadLess>
                                    {/* <p className="text-dark mb-1"></p> */}
                                    <Rating count={5} value={review.rating} edit={false} size={18} activeColor="#b4633a" />
                                    <div className="mt-2 flex gap-2">
                                        {review.images.map((src, idx) => (
                                            <img key={idx} src={src?.fileUrl} className="rounded" alt="review" width={50} height={50} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
