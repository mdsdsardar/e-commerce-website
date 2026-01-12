import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader";
import toast from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import Sidebar from "./Sidebar";
import {
  clearProductDetailsErrors,
  deleteReview,
  productReviews,
  resetDeleteProduct,
} from "../../slices/product.slice";

const ProductReviews = () => {
  const [productId, setProductId] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, reviews, isDeleted } = useSelector(
    (state) => state.productDetails
  );
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProductDetailsErrors());
    }
    if (productId !== "") {
      dispatch(productReviews(productId));
    }
    if (isDeleted) {
      toast.success("Review deleted succesfully");
      dispatch(resetDeleteProduct());
    }
  }, [dispatch, error, productId, isDeleted]);
  const deleteReviewHandler = (productId, id) => {
    console.log("Deleting:", productId, id);
    dispatch(deleteReview({ productId, id }));
  };
  // Ensure orders is an array before mapping
  // if (!Array.isArray(reviews) || reviews.length === 0) {
  //   return (
  //     <div>
  //       <h1 className="mt-5">All Reviews</h1>
  //       <p>No Review found.</p>
  //     </div>
  //   );
  // }
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(productReviews(productId));
  };
  // Map orders to rows with proper id field
  const rows = reviews.map((review) => ({
    id: review._id, // MUI DataGrid requires 'id' field
    rating: review.rating,
    comment: review.comment,
    user: review.user,
    // orderId: order._id, // Keep original ID htmlFor actions {seems useless}
  }));

  const columns = [
    {
      field: "id",
      headerName: "Review ID",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "comment",
      headerName: "Comment",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "user",
      headerName: "User",
      flex: 1,
      minWidth: 120,
      // renderCell: (params) => (
      //   <p
      //     style={{
      //       color: params.value?.includes("Delivered") ? "green" : "red",
      //       margin: 0,
      //     }}
      //   >
      //     {params.value}
      //   </p>
      // ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Fragment>
          {/* <Link
            to={`/admin/review/${params.row.id}`}
            className="btn btn-primary py-1 px-2"
          >
            <i className="fa fa-pencil"></i>
          </Link> */}
          <button
            className="btn btn-danger py-1 px-2 ml-2"
            onClick={() => deleteReviewHandler(productId, params.row.id)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </Fragment>
      ),
    },
  ];
  return (
    <Fragment>
      <MetaData title={"Product Reviews"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            <div className="row justify-content-center mt-5">
              <div className="col-5">
                <form onSubmit={submitHandler}>
                  <div className="form-group">
                    <label htmlFor="productId_field">Enter Product ID</label>
                    <input
                      type="text"
                      id="productId_field"
                      className="form-control"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                    />
                  </div>

                  <button
                    id="search_button"
                    type="submit"
                    className="btn btn-primary btn-block py-2"
                  >
                    SEARCH
                  </button>
                </form>
              </div>
            </div>
            {reviews && reviews.length > 0 ? (
              <div style={{ width: "100%" }}>
                <h1 className="my-5">All Reviews</h1>
                <div style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    autoHeight
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    disableRowSelectionOnClick
                    sx={{
                      "& .MuiDataGrid-row": {
                        cursor: "pointer",
                      },
                    }}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-5 text-center">No Reviews</p>
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;
