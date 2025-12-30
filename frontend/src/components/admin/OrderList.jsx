import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader";
import toast from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import Sidebar from "./Sidebar";
import {
  allOrders,
  clearError,
  deleteOrder,
  deleteOrderReset,
} from "../../slices/orderSlice";

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, allOrder, isDeleted } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(allOrders());
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (isDeleted) {
      toast.success("Order deleted succesfully");
      navigate("/admin/orders");
      dispatch(deleteOrderReset());
    }
  }, [dispatch, toast, error, isDeleted]);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };
  // Ensure orders is an array before mapping
  if (!Array.isArray(allOrder) || allOrder.length === 0) {
    return (
      <div>
        <h1 className="mt-5">Products</h1>
        <p>No Orders found.</p>
      </div>
    );
  }
  // Map orders to rows with proper id field
  const rows = allOrder.map((order) => ({
    id: order._id, // MUI DataGrid requires 'id' field
    numOfItems: order.orderItems.length,
    amount: `$${order.totalPrice}`,
    status: order.orderStatus,
    // orderId: order._id, // Keep original ID for actions {seems useless}
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
      headerName: "No of Items",
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
        <Fragment>
          <Link
            to={`/admin/order/${params.row.id}`}
            className="btn btn-primary py-1 px-2"
          >
            <i className="fa fa-eye"></i>
          </Link>
          <button
            className="btn btn-danger py-1 px-2 ml-2"
            onClick={() => deleteOrderHandler(`${params.row.id}`)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </Fragment>
      ),
    },
  ];
  return (
    <Fragment>
      <MetaData title={"All Orders"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">All Orders</h1>
            {loading ? (
              <Loader />
            ) : (
              <div style={{ width: "100%" }}>
                <h1 className="my-5">All Orders</h1>
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
        </div>
      </div>
    </Fragment>
  );
};

export default OrderList;
