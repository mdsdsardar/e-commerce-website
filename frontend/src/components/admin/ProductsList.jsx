import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
// import { MDBDataTable } from "mdbreact";
import Loader from "../layout/Loader";
import toast from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import {
  clearProductDetailsErrors,
  clearProductErrors,
  deleteProduct,
  getAdminProducts,
  resetDeleteProduct,
} from "../../slices/productSlice";
import Sidebar from "./Sidebar";
import { useState } from "react";

const ProductsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, products, totalProducts } = useSelector(
    (state) => state.products
  );
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.productDetails
  );
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // MUI DataGrid uses 0-based indexing
    pageSize: 5, // rows per page
  });

  // Fetch data whenever pagination changes
  useEffect(() => {
    const currentPage = paginationModel.page + 1; // Convert to 1-based for backend
    const resPerPage = paginationModel.pageSize;

    dispatch(getAdminProducts({resPerPage, currentPage}));

    // dispatch(getAdminProducts());
    if (error) {
      toast.error(error);
      dispatch(clearProductErrors());
    }
    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearProductDetailsErrors());
    }
    if (isDeleted) {
      toast.success("Product deleted succesfully");
      navigate("/admin/products");
      dispatch(resetDeleteProduct());
    }
  }, [
    dispatch,
    paginationModel,
    toast,
    error,
    deleteError,
    isDeleted,
    navigate,
  ]);

  // Ensure orders is an array before mapping
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div>
        <h1 className="mt-5">Products</h1>
        <p>No Products found.</p>
      </div>
    );
  }
  // Map orders to rows with proper id field
  const rows = products.map((product) => ({
    id: product._id, // MUI DataGrid requires 'id' field
    name: product.name,
    price: `$${product.price}`,
    stock: product.stock,
  }));

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "stock",
      headerName: "Stock",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Fragment>
          <Link
            to={`/admin/products/${params.row.id}`}
            className="btn btn-primary py-1 px-2"
          >
            <i className="fa fa-pencil"></i>
          </Link>
          <button
            className="btn btn-danger py-1 px-2 ml-2"
            onClick={() => deleteProductHandler(`${params.row.id}`)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </Fragment>
      ),
    },
  ];
  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };
  return (
    <Fragment>
      <MetaData title={"All Products"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">All Products</h1>
            {loading ? (
              <Loader />
            ) : (
              <div style={{ width: "100%" }}>
                <h1 className="my-5">My Products</h1>
                <div style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    autoHeight
                    pageSizeOptions={[5, 10, 25]}
                    paginationMode="server" // Important for server-side pagination
                    rowCount={totalProducts} // Total number of products from backend
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5 } },
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
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductsList;
