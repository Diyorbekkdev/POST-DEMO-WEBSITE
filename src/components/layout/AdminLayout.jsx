import { Fragment } from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <Fragment>
      <header>Admin Header</header>
      <main>
        <Outlet />
      </main>
      <footer>Admin Footer</footer>
    </Fragment>
  );
};

export default AdminLayout;
