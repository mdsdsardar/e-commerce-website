import React from "react";

const ListReviews = ({ reviews }) => {
  // Add curly braces here
  return (
    <div className="reviews w-75">
      <h3>Other's Reviews:</h3>
      <hr />
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} className="review-card my-3">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${(review.rating / 5) * 100}%` }}
              ></div>
            </div>
            <p className="review_user">by {review.name}</p>
            <p className="review_comment">{review.comment}</p>
            <hr />
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default ListReviews;
//productDetails.reviews.map((review) => <p>{review.comment}</p>)
