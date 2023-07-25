import { Spin } from "antd";
import { Fragment, useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import FrontLayout from "./components/layout/FrontLayout";
import AdminLayout from "./components/layout/AdminLayout";
import AllPosts from "./pages/admin/AllPosts";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/user/home/HomePage";
import LoginPage from "./pages/user/Auth/login/LoginPage";
import RegisterPage from "./pages/user/Auth/Register/RegisterPage";
import PostsPage from "./pages/user/allposts/PostsPage";
import PostPage from "./pages/user/singlePost/PostPage";
import MyPostsPage from "./pages/user/myPost/MyPostsPage";
import AccountPage from "./pages/user/userAccount/AccountPage";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import CategoryPosts from "./pages/user/category/CategoryPosts";
import About from "./pages/user/about/About";

function App() {
  let { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return <div className="main_loading"><Spin size="large"/></div>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="posts/:id" element={<PostPage />} />
          <Route path="category/:id" element={<CategoryPosts />} />
          {isAuthenticated && (
            <Fragment>
              <Route path="my-posts" element={<MyPostsPage />} />
              <Route path="account" element={<AccountPage />} />
            </Fragment>
          )}
        </Route>
        {isAuthenticated && (
          <Fragment>
            <Route path="/" element={<AdminLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="all-posts" element={<AllPosts />} />
            </Route>
          </Fragment>
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
 