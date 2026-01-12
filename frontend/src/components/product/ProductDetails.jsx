import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearProductDetailsErrors,
  getProductDetails,
  newReview,
  resetReview,
} from "../../slices/product.slice";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { Carousel } from "react-bootstrap";
import { addItemToCart } from "../../slices/cart.slice";
import ListReviews from "../review/ListReviews";

// const ProductDetails = ({ match }) => {
const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const setUserRatings = () => {
    setShowModal(true);
  };
  const { id } = useParams(); // ✅ URL param, match alternative
  const dispatch = useDispatch();
  const { loading, error, productDetails, success } = useSelector(
    (state) => state.productDetails
  );
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    // Dispatch the async thunk to fetch products
    if (error) {
      toast.error(error); // 🔥 replacement
      dispatch(clearErrors());
      return;
    }
    dispatch(getProductDetails(id));
    // // Cleanup: clear errors when component unmounts
    // return () => {
    //   dispatch(clearErrors());
    // };
    if (success) {
      toast.success("Review posted Succesfully"); // 🔥 replacement
      dispatch(resetReview());
      return;
    }
  }, [dispatch, id, error, success]);

  const addToCart = () => {
    dispatch(addItemToCart({ id, quantity }));
    toast.success("Item added to Cart.");
  };

  const increaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber >= productDetails.stock) return;
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };
  const decreaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber <= 1) return;
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };
  // function setUserRatings() {
  //   const stars = document.querySelectorAll(".star");
  //   stars.forEach((star, index) => {
  //     star.starValue = index + 1;
  //     ["click", "mouseover", "mouseout"].forEach(function (e) {
  //       star.addEventListener(e, showRatings);
  //     });
  //   });
  //   function showRatings(e) {
  //     startSession.forEach((star, index) => {
  //       if (e.type === "click") {
  //         if (index < this.starValue) {
  //           star.classList.add("orange");
  //         } else {
  //           star.classList.remove("orange");
  //         }
  //       }
  //       if (e.type === "mouseover") {
  //         if (index < this.starValue) {
  //           star.classList.add("yellow");
  //         } else {
  //           star.classList.remove("yellow");
  //         }
  //       }
  //       if (e.type === "mouseout") {
  //         if (index < this.starValue) {
  //           star.classList.add("red");
  //         } else {
  //           star.classList.remove("red");
  //         }
  //       }
  //     });
  //   }
  // }
  const submitReviewHandler = () => {
    const formData = new FormData();
    formData.set("rating", rating);
    formData.set("comment", comment);
    formData.set("productId", id);
    dispatch(newReview(formData));
    setShowModal(false);
  };
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={productDetails.name} />
          <div className="container container-fluid">
            <div className="row f-flex justify-content-around">
              <div className="col-12 col-lg-5 img-fluid" id="product_image">
                <Carousel pause="hover">
                  {productDetails.images &&
                    productDetails.images.map((image) => (
                      <Carousel.Item key={image.public_id}>
                        <img
                          className="d-block w-100"
                          src={image.url}
                          alt={productDetails.title}
                        />
                      </Carousel.Item>
                    ))}
                </Carousel>
              </div>

              <div className="col-12 col-lg-5 mt-5">
                <h3>{productDetails.name}</h3>
                <p id="product_id">Product # {productDetails._id}</p>

                <hr />

                <div className="rating-outer">
                  <div
                    className="rating-inner"
                    style={{ width: `${(productDetails.ratings / 5) * 100}%` }}
                  ></div>
                </div>
                <span id="no_of_reviews">
                  ({productDetails.numOfReviews} Reviews)
                </span>

                <hr />

                <p id="product_price">{productDetails.price}</p>
                <div className="stockCounter d-inline">
                  <span className="btn btn-danger minus" onClick={decreaseQty}>
                    -
                  </span>

                  <input
                    type="number"
                    className="form-control count d-inline"
                    value={quantity}
                    readOnly
                  />

                  <span className="btn btn-primary plus" onClick={increaseQty}>
                    +
                  </span>
                </div>
                <button
                  type="button"
                  id="cart_btn"
                  className="btn btn-primary d-inline ml-4"
                  disabled={productDetails.stock === 0}
                  onClick={addToCart}
                >
                  Add to Cart
                </button>

                <hr />

                <p>
                  Status:{" "}
                  <span
                    id="stock_status"
                    className={
                      productDetails.stock > 0 ? "greenColor" : "redColor"
                    }
                  >
                    {productDetails.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </p>

                <hr />

                <h4 className="mt-2">Description:</h4>
                <p>{productDetails.description}</p>
                <hr />
                <p id="product_seller mb-3">
                  Sold by: <strong>{productDetails.seller}</strong>
                </p>
                {user ? (
                  <button
                    id="review_btn"
                    type="button"
                    className="btn btn-primary mt-4"
                    onClick={setUserRatings}
                  >
                    Submit Your Review
                  </button>
                ) : (
                  <div className="alert alert-danger mt-5" type="alert">
                    Login to Post your review
                  </div>
                )}

                {/* Modal */}
                {showModal && (
                  <>
                    <div
                      className="modal fade show"
                      style={{ display: "block" }}
                      tabIndex="-1"
                      role="dialog"
                    >
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Submit Review</h5>
                            <button
                              type="button"
                              className="close"
                              onClick={() => setShowModal(false)}
                            >
                              <span>&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <ul
                              className="stars"
                              style={{
                                display: "flex",
                                listStyle: "none",
                                padding: 0,
                              }}
                            >
                              {[1, 2, 3, 4, 5].map((star) => (
                                <li
                                  key={star}
                                  className="star"
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "2rem",
                                    marginRight: "5px",
                                  }}
                                  onClick={() => setRating(star)}
                                >
                                  <i
                                    className={`fa fa-star${
                                      star <= rating ? "" : "-o"
                                    }`}
                                    style={{
                                      color:
                                        star <= rating ? "#ffb829" : "#ccc",
                                    }}
                                  ></i>
                                </li>
                              ))}
                            </ul>

                            <textarea
                              name="review"
                              id="review"
                              className="form-control mt-3"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Write your review..."
                              rows="4"
                            ></textarea>

                            <button
                              className="btn my-3 float-right review-btn px-4 text-white"
                              onClick={submitReviewHandler}
                              style={{ backgroundColor: "#fa9c23" }}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Backdrop */}
                    <div
                      className="modal-backdrop fade show"
                      onClick={() => setShowModal(false)}
                    ></div>
                  </>
                )}

                {/* {user ? (
                  <button
                    id="review_btn"
                    type="button"
                    className="btn btn-primary mt-4"
                    data-toggle="modal"
                    data-target="#ratingModal" onClick={setUserRatings}
                  >
                    Submit Your Review
                  </button>
                ) : (
                  <div className="alert alert-danger mt-5" type="alert">
                    {" "}
                    Login to Post your review{" "}
                  </div>
                )}

                <div className="row mt-2 mb-5">
                  <div className="rating w-50">
                    <div
                      className="modal fade"
                      id="ratingModal"
                      tabIndex="-1"
                      role="dialog"
                      aria-labelledby="ratingModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="ratingModalLabel">
                              Submit Review
                            </h5>
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <ul className="stars">
                              <li className="star">
                                <i className="fa fa-star"></i>
                              </li>
                              <li className="star">
                                <i className="fa fa-star"></i>
                              </li>
                              <li className="star">
                                <i className="fa fa-star"></i>
                              </li>
                              <li className="star">
                                <i className="fa fa-star"></i>
                              </li>
                              <li className="star">
                                <i className="fa fa-star"></i>
                              </li>
                            </ul>

                            <textarea
                              name="review"
                              id="review"
                              className="form-control mt-3"
                            ></textarea>

                            <button
                              className="btn my-3 float-right review-btn px-4 text-white"
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {productDetails.reviews && productDetails.reviews.length > 0 && (
            <ListReviews reviews={productDetails.reviews} />
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
