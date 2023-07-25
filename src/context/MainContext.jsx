import { createContext, useEffect, useState } from "react";
import { request } from "../server/request";
import { useNavigate } from "react-router-dom";
// import { request } from "../server/request";

export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [popularPost, setPopularPost] = useState(null);
  const [postId, setPostId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  
  // postsPage state management
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);


  useEffect(() => {
    request.get("category").then((response) => {
      setCategories(response.data.data);
    });
  }, [setCategories]);


  const contextValue = {
    popularPost,
    setPopularPost,
    postId,
    setPostId,
    posts,
    setPosts,
    search,
    setSearch,
    total,
    setTotal,
    page,
    setPage,
    categoryId, 
    setCategoryId,
    setCategories,
    categories,
    uploadedImage,
    setUploadedImage,
  };

  return (
    <MainContext.Provider value={contextValue}>{children}</MainContext.Provider>
  );
};
