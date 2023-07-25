import { Fragment } from "react";
import { Outlet } from "react-router-dom";

import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import DarkMode from "../DarkMode/DarkMode";

const FrontLayout = () => {
  return (
    <Fragment>
        <Header />
        <main>
          <DarkMode />
          <Outlet />
        </main>
        <Footer />
    </Fragment>
  );
};

export default FrontLayout;
