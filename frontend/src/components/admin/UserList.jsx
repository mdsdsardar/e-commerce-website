import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader";
import toast from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import Sidebar from "./Sidebar";
import {
  allUsers,
  clearError,
  deleteUser,
  deleteUserReset,
} from "../../slices/authSlice";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    usersLoading: loading,
    error,
    allUser,
    isDeleted,
  } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(allUsers());

    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (isDeleted) {
      toast.success("User deleted succesfully");
      navigate("/admin/users");
      dispatch(deleteUserReset());
    }
  }, [dispatch, error, isDeleted]);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };
  // Ensure orders is an array before mapping
  if (!Array.isArray(allUser) || allUser.length === 0) {
    return (
      <div>
        <h1 className="mt-5">All Users</h1>
        <p>No User found.</p>
      </div>
    );
  }
  // Map orders to rows with proper id field
  const rows = allUser.map((user) => ({
    id: user._id, // MUI DataGrid requires 'id' field
    name: user.name,
    email: user.email,
    role: user.role,
    // orderId: order._id, // Keep original ID for actions {seems useless}
  }));

  const columns = [
    {
      field: "id",
      headerName: "User ID",
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
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "role",
      headerName: "Role",
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
          <Link
            to={`/admin/user/${params.row.id}`}
            className="btn btn-primary py-1 px-2"
          >
            <i className="fa fa-pencil"></i>
          </Link>
          <button
            className="btn btn-danger py-1 px-2 ml-2"
            onClick={() => deleteUserHandler(`${params.row.id}`)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </Fragment>
      ),
    },
  ];
  return (
    <Fragment>
      <MetaData title={"All Users"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">All Users</h1>
            {loading ? (
              <Loader />
            ) : (
              <div style={{ width: "100%" }}>
                <h1 className="my-5">All Users</h1>
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

export default UserList;
