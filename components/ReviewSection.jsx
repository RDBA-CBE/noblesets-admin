import React, { useState } from 'react';
import Rating from 'react-rating-stars-component';
// import ProfileImage from "@assets/img/actors/actors-image";
import ReactReadMoreReadLess from "react-read-more-read-less";

const initialReviews = [
  {
    name: 'Alexander Rity',
    avatar: "/assets/images/user.png",
    date: '4 months ago',
    rating: 5,
    comment:
      'Easy booking, great value! Cozy rooms at a reasonable price in Sheffield’s vibrant center. Surprisingly quiet with nearby Traveller’s accommodations. Highly recommended!',
    images: [1, 2, 3, 4].map(() => '/assets/img/placeholder-portrait.png'),
  },
  {
    name: 'Emma Creight',
    avatar: "/assets/images/user.png",

    date: '4 months ago',
    rating: 4,
    comment:
      'Effortless booking, unbeatable affordability! Small yet comfortable rooms in the heart of Sheffield’s nightlife hub. Surrounded by elegant housing, it’s a peaceful gem. Thumbs up!',
    images: [],
  },
  {
    name: 'Emma Creight',
    avatar: "/assets/images/user.png",

    date: '4 months ago',
    rating: 4,
    comment:
      'Effortless booking, unbeatable affordability! Small yet comfortable rooms in the heart of Sheffield’s nightlife hub. Surrounded by elegant housing, it’s a peaceful gem. Thumbs up!',
    images: [],
  },
  {
    name: 'Emma Creight',
    avatar: "/assets/images/user.png",

    date: '4 months ago',
    rating: 4,
    comment:
      'Effortless booking, unbeatable affordability! Small yet comfortable rooms in the heart of Sheffield’s nightlife hub. Surrounded by elegant housing, it’s a peaceful gem. Thumbs up!',
    images: [],
  },
  {
    name: 'Emma Creight',
    avatar: "/assets/images/user.png",

    date: '4 months ago',
    rating: 4,
    comment:
      'Effortless booking, unbeatable affordability! Small yet comfortable rooms in the heart of Sheffield’s nightlife hub. Surrounded by elegant housing, it’s a peaceful gem. Thumbs up!',
    images: [],
  },
];

const ReviewSection = (props) => {
  const {reviewList}=props
  const [reviews, setReviews] = useState(initialReviews);
  const [showAll, setShowAll] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    comment: '',
    rating: 0,
    images:[]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      name: formData.name,
      avatar: 'https://via.placeholder.com/40',
      date: 'Just now',
      rating: formData.rating,
      comment: formData.comment,
      images: formData.images,
    };
    setReviews([newReview, ...reviews]);
    setFormData({ name: '', comment: '', rating: 0 });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: imageUrls });
  };

  return (
    <div className="container py-5 review-sec">
      <div className="row g-4">
        <div className="col-lg-12">
          <div className="review-box p-4 bg-white shadow-sm rounded">

            
            {reviews.map((review, index) => (
              <div key={index} className="mb-4">
                <div className="flex align-items-center mb-2">
                  <img src={review.avatar} alt="avatar" className="rounded-circle me-2" width={50}/>
                  <div>
                    <strong>{review.name}</strong>
                    <p className="text-muted small m-0">{review.date}</p>
                  </div>
                </div>
                <ReactReadMoreReadLess
                charLimit={150}
                readMoreText={"Read more "}
                readLessText={"Read less "}
                readMoreClassName={"text-[#b4633a] underline"}
                readLessClassName={"text-[#b4633a] underline"}

            >
             {review.comment}
            </ReactReadMoreReadLess>
                {/* <p className="text-dark mb-1"></p> */}
                <Rating count={5} value={review.rating} edit={false} size={18} activeColor="#b4633a" />
                <div className="flex gap-2 mt-2">
                  {review.images.map((src, idx) => (
                    <img key={idx} src={src} className="rounded" alt="review" width={30} height={30}/>
                  ))}
                </div>
              </div>
            ))}

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
