import React, { Fragment, useState, useEffect } from "react";
import {
  getProducts,
  clearProductErrors,
  setLoading,
} from "../slices/product.slice";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import MetaData from "./layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import Product from "./product/Product";
import Loader from "./layout/Loader";
// import { useAlert } from "react-alert";
import toast from "react-hot-toast";
// import Pagination from "react-js-pagination";
import ReactPaginate from "react-paginate";
import { useParams } from "react-router-dom";

// const { Range } = Slider;
const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);
  const [category, setcategory] = useState("");
  const [rating, setRating] = useState(0);
  const categories = [
    "Electronics",
    "Cameras",
    "Laptop",
    "Accessories",
    "Headphones",
    "Food",
    "Books",
    "Clothes/Shoes",
    "Sports",
    "Beauty/Health",
    "Outdoor",
    "Home",
  ];
  const { keyword } = useParams();
  // useDispatch hook to dispatch actions
  // const alert = useAlert();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getProducts());
  // }, [dispatch]);
  // useSelector hook to access Redux state
  // state.products matches the key we used in store configuration
  const { products, loading, error, productsCount, resPerPage } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    // Dispatch the async thunk to fetch products
    if (error) {
      toast.error(error); // 🔥 replacement
      return;
    }
    dispatch(setLoading(true));
    dispatch(getProducts({ keyword, currentPage, price, category, rating }));
    // return () => {
    //   dispatch(clearErrors());
    // };
  }, [dispatch, error, keyword, currentPage, price, category, rating]);

  // function setCurrentPageNo(pageNumber) {
  //   setCurrentPageNo(pageNumber);
  // }
  const itemsPerPage = resPerPage || 10;
  const totalItems = productsCount || 0;
  const pageCount = itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 0;
  const safeForcePage =
    pageCount > 0 && currentPage > 0
      ? Math.min(currentPage - 1, pageCount - 1)
      : undefined; // if (pageCount < 1) return null;
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Product Online"} />
          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {keyword ? (
                <Fragment>
                  <div className="col-6 col-md-3 mt-5 mb-5">
                    <div className="px-5">
                      <Slider
                        range
                        min={1}
                        max={1000}
                        marks={{ 1: "$1", 1000: "$1000" }}
                        tipFormatter={(value) => `$${value}`}
                        tipProps={{
                          placement: "top",
                          visible: true,
                        }}
                        value={price}
                        onChange={(price) => setPrice(price)}
                      />
                      <hr className="my-5" />
                      <div className="mt-5">
                        <h4 className="mb-5">categories</h4>
                        <ul className="pl-0">
                          {categories.map((category) => (
                            <li
                              style={{
                                cursor: "pointer",
                                listStyleType: "none",
                              }}
                              key={category}
                              onClick={() => setcategory(category)}
                            >
                              {category}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <hr className="my-3" />
                      <div className="mt-5">
                        <h4 className="mb-5">categories</h4>
                        <ul className="pl-0">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <li
                              style={{
                                cursor: "pointer",
                                listStyleType: "none",
                              }}
                              key={star}
                              onClick={() => setRating(star)}
                            >
                              <div className="rating-outer">
                                <div
                                  className="rating-inner"
                                  style={{
                                    width: `${star * 20}%`,
                                  }}
                                ></div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-9">
                    <div className="row">
                      {products &&
                        products.map((product) => (
                          <Product
                            key={product._id}
                            product={product}
                            col={4}
                          />
                        ))}
                    </div>
                  </div>
                </Fragment>
              ) : (
                products &&
                products.map((product) => (
                  <Product key={product._id} product={product} col={3} />
                ))
              )}
            </div>
          </section>

          {/* <Pagination
              activePage={currentPage || 1}
              itemsCountPerPage={resPerPage || 10}
              totalItemsCount={productsCount || 0}
              onChange={setCurrentPageNo}
              nextPageText={"Next"}
              prevPageText={"Prev"}
              firstPageText={"First"}
              itemClass="page-item"
              linkClass="page-link"
            /> */}
          {resPerPage <= productsCount && (
            <div className="d-flex justify-content-center mt-5">
              <ReactPaginate
                pageCount={pageCount}
                {...(safeForcePage !== undefined && {
                  forcePage: safeForcePage,
                })}
                onPageChange={(e) => setCurrentPage(e.selected + 1)}
                previousLabel="Prev"
                nextLabel="Next"
                breakLabel="..."
                // Custom rendering for first/last page links
                pageLabelBuilder={(page) => {
                  const totalPages = Math.ceil(
                    (productsCount || 0) / (resPerPage || 10)
                  );
                  if (page === 1) return "First";
                  if (page === totalPages) return "Last";
                  return page;
                }}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                activeClassName="active"
                disabledClassName="disabled"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
