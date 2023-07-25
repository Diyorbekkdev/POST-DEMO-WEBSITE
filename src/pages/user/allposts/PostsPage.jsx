import { Input, Pagination, Spin } from "antd";
import { Fragment, useCallback, useContext, useEffect} from "react";
import { AudioOutlined } from "@ant-design/icons";
import { request } from "../../../server/request";
import { IMG_URl, LIMIT } from "../../../const";
import { MainContext } from "../../../context/MainContext";
import { useNavigate } from "react-router-dom";
import AllPostsCard from "./AllPostsCard";
import { useState } from "react";

//style
import "./myposts.scss";
const PostsPage = () => {
  const navigate = useNavigate();
  const {setPostId, posts, setPosts, search, setSearch, total, setTotal, page, setPage } =
    useContext(MainContext);
  const [loading, setLoading] = useState(false);

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

  const getPosts = useCallback(async () => {
    try {
      setLoading(true)
      let { data } = await request.get(
        `post?page=${page}&limit=${LIMIT}&search=${search}`
      );
      setPosts(data.data);
      setTotal(data.pagination.total);
      setLoading(false)
    } catch (err) {
      console.log(err);
    }
  }, [page, search, setTotal, setPosts]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const getPostId = (id) => {
    setPostId(id);
    navigate(`${id}`);
  };


  return (
    <Fragment>
      <section id="all_posts" className="all_posts">
        <div className="container">
          <div className="search_wrapper">
            <Search
              placeholder="input search text"
              enterButton="Search"
              size="large"
              suffix={suffix}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="posts_title">
            <h1>All posts</h1>
            <div className="line"></div>
          </div>
        </div>
      </section>
      <section className="all_cards">
        <div className="container posts_row">
          {loading ? <div className="center"><Spin size="large"/></div> : posts.map((res) => (
            <AllPostsCard
              key={res._id}
              title={res.title}
              category={res.category.name}
              info={res.description}
              onClick={() => getPostId(res._id)}
              img={`${IMG_URl + res?.photo?._id}.${
                res?.photo?.name.split(".")[1]
              }`}
            />
          ))}
          <Pagination current={page} onChange={onChange} total={total} />
        </div>
      </section>
    </Fragment>
  );
};

export default PostsPage;
