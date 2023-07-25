import { Fragment, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../../../server/request";
import { MainContext } from "../../../context/MainContext";

//local components
import PopularCard from "./PopularCard/PopularCard";
import Button from "../../../components/Button/Button";
import CategoryCard from "./CategoryCard/CategoryCard";


// style
import "./home.scss";
const HomePage = () => {
  const {setPostId} = useContext(MainContext);
  const [lastone, setLastone] = useState([])
  const navigate = useNavigate();
  
  useEffect(() => {
    request.get("post/lastone").then((response) => {
     setLastone(response.data);
    });
  }, []);

  if (!lastone) return null;
  const getPostId = (id) => {
    setPostId(id);
    navigate(`posts/${id}`);
  };

  return (
    <Fragment>
      <section
        className="latest__post"
        style={{
          background:
            'radial-gradient(80.99% 71.93% at 74.58% 0.00%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%), url("https://www.shoutmeloud.com/wp-content/uploads/2018/06/Difference-Between-Posts-Pages-In-WordPress.jpg") center center, no-repeat',
            backgroundRepeat: "no-repeat",
            backgroundPosition: 'center',
            backgroundSize: 'cover'
        }}
      >
        <div className="container">
          <div className="latest__post--wrapper">
            <p className="info">
              Posted on <span>{lastone?.category?.name}</span>
            </p>
            <h1 className="heading">
              <span className="underlined underlined--reverse">
              {lastone?.title}
              </span>
            </h1>
            <p className="user">
              By <span>{lastone?.user?.first_name}</span> | {lastone?.createdAt?.split('T')[0]}
            </p>
            <p className="main_info">
              {lastone?.description}
            </p>
            <Button onClick={() => getPostId(`${lastone?._id}`)} text="Read More >" />
          </div>
        </div>
      </section>
      <section className="popular">
        <div className="container">
          <div className="wrapper">
            <h1>Popular blogs</h1>
            <Link to="/posts">{`See all posts >`}</Link>
          </div>
          <div className="card_wrapper">
              <PopularCard />
          </div>
        </div>
      </section>
      <section className="category">
        <div className="container">
          <div className="title"><h1>Choose A Catagory</h1></div>
          <div className="category__card__wrapper">
            <CategoryCard/>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default HomePage;
