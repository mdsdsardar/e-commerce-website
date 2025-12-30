import { Outlet, useLocation } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="container container-fluid">
      <Outlet />
    </div>
  );
};

export default UserLayout;