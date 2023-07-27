import { AudioOutlined } from "@ant-design/icons";
import { Input, Pagination, Empty } from "antd";
import { useCallback, useContext, useEffect, useState } from "react";
import { MainContext } from "../../../context/MainContext";
import { LIMIT } from "../../../const";
import { request } from "../../../server/request";
import { useNavigate } from "react-router-dom";

import AllPostsCard from "../allposts/AllPostsCard";

import "./categories.scss";

const CategoryPosts = () => {
  const navigate = useNavigate();

  const {
    setSearch,
    page,
    categoryId,
    search,
    setPosts,
    posts,
    setTotal,
    setPostId,
    setPage,
    total,
    categories,
    setCategoryId,
    setCategories,
  } = useContext(MainContext);

  const [categoryName, setCategorName] = useState("");


  useEffect(() => {
    request.get("category").then((response) => {
      setCategories(response.data.data);
    });
  }, [setCategories]);

  useEffect(() => {
    request.get(`category/${categoryId}`).then((response) => {
      setCategorName(response.data);
    });
  }, [categoryId, setCategories]);

  const getPosts = useCallback(async () => {
    try {
      let { data } = await request.get(
        `post?page=${page}&limit=${LIMIT}&search=${search}`
      );
      let filteredPosts = data.data.filter(
        (res) => res.category._id === categoryId
      );
      setPosts(filteredPosts);
      setTotal(filteredPosts.length);
    } catch (err) {
      console.log(err);
    }
  }, [page, search, setTotal, categoryId, setPosts]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const { Search } = Input;
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );

  const onChange = (page) => {
    setPage(page);
  };

  const getPostId = (id) => {
    setPostId(id);
    navigate(`/posts/${id}`);
  };

  const handleCategoryChange = (categoryId) => {
    setCategoryId(categoryId);
  };

  
  return (
    <section className="category__posts">
      <div className="category__wrapper">
        <h1>{categoryName?.name}</h1>
        <p className="description">{categoryName?.description}</p>
        <p className="show_direction">
          Blog ➡️
          <select className="custom">
            {categories?.map((category) => (
              <option
                key={category?._id}
                className={categoryId === category?._id ? "active" : ""}
                onClick={() => handleCategoryChange(category?._id)}
                value="value"
              >
                {category?.name}
              </option>
            ))}
          </select>
        </p>
      </div>
      <div className="container">
        <div className="searching">
          <Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            suffix={suffix}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="categorys_posts">
          {total == 0 ? (
            <Empty />
          ) : (
            posts.map((res) => (
              <AllPostsCard
                key={res._id}
                title={res.title}
                category={res.category.name}
                info={res.description}
                onClick={() => getPostId(res._id)}
              />
            ))
          )}
          {total !== 0 ? (
            <Pagination
              current={page}
              defaultCurrent={page}
              onChange={onChange}
              total={total}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryPosts;
