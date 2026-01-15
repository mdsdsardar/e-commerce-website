import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeFromCart } from "../../slices/cart.slice";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
// import { MDBDataTable } from "mdbreact";
import Loader from "../layout/Loader";
import toast from "react-hot-toast";
import { clearError, myOrder } from "../../slices/order.slice";
import { DataGrid } from "@mui/x-data-grid";

const ListOrders = () => {
  const dispatch = useDispatch();
  const { loading, error, order:orders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(myOrder());
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, toast, error]);

 // Ensure orders is an array before mapping
  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div>
        <h1 className="mt-5">My Orders</h1>
        <p>No orders found.</p>
      </div>
    );
  }
  // Map orders to rows with proper id field
  const rows = orders.map((order) => ({
    id: order._id, // MUI DataGrid requires 'id' field
    numOfItems: order.orderItems?.length || 0,
    amount: `$${order.totalPrice}`,
    status: order.orderStatus,
    orderId: order._id, // Keep original ID for actions
  }));

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "numOfItems",
      headerName: "Num of Items",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <p
          style={{
            color: params.value?.includes("Delivered") ? "green" : "red",
            margin: 0,
          }}
        >
          {params.value}
        </p>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/order/${params.row.id}`} className="btn btn-primary">
          <i className="fa fa-eye"></i>
        </Link>
      ),
    },
  ];

  return (
    <Fragment>
      <MetaData title={"List Orders"} />
      {loading ? (
        <Loader />
      ) : (
        <div style={{ width: "100%" }}>
          <h1 className="my-5">My Orders</h1>
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
      )}
    </Fragment>
  );
};

export default ListOrders;
