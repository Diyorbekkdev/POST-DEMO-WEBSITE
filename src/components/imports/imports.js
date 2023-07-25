// Import React-related dependencies
import { Fragment, lazy, Suspense } from 'react';

// Import React Router-related dependencies
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Import your layout components
import FrontLayout from './layout/FrontLayout';
import AdminLayout from './layout/AdminLayout';

// Import your user pages/components
const HomePage = lazy(() => import('../pages/user/HomePage'));
const AboutPage = lazy(() => import('../pages/user/AboutPage'));
const LoginPage = lazy(() => import('../pages/user/LoginPage'));
const RegisterPage = lazy(() => import('../pages/user/RegisterPage'));
const PostsPage = lazy(() => import('../pages/user/PostsPage'));
const PostPage = lazy(() => import('../pages/user/PostPage'));
const MyPostsPage = lazy(() => import('../pages/user/MyPostsPage'));
const AccountPage = lazy(() => import('../pages/user/AccountPage'));

// Import your admin pages/components
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const UsersPage = lazy(() => import('../pages/admin/UsersPage'));
const CategoriesPage = lazy(() => import('../pages/admin/CategoriesPage'));
const AllPosts = lazy(() => import('../pages/admin/AllPosts'));

// Export all the components/constants you want to use in your App.js
export {
  Fragment,
  lazy,
  Suspense,
  BrowserRouter,
  Route,
  Routes,
  FrontLayout,
  AdminLayout,
  HomePage,
  AboutPage,
  LoginPage,
  RegisterPage,
  PostsPage,
  PostPage,
  MyPostsPage,
  AccountPage,
  DashboardPage,
  UsersPage,
  CategoriesPage,
  AllPosts,
};
