import {useCallback, useContext, useEffect, useState } from "react";
import { MainContext } from "../../../context/MainContext";
import { request } from "../../../server/request";
import { IMG_URl } from "../../../const";

// style
import "./singlepost.scss";
const PostPage = () => {
  const { postId } = useContext(MainContext);
  const [data, setData] = useState([]);

  const getData = useCallback(async () => {
    try {
      let {data} = await request.get(`post/${postId}`);
      setData(data);
    } catch (err) {
      console.log(err);
    }
  }, [postId]);

console.log(data);
  useEffect(() => {
    getData();
  }, [getData]);

  
  return (
    <section className="post_page">
      <div className="container">
            <div className="img__box">
              <img
                src={`${IMG_URl + data?.photo?._id}.${
                  data?.photo?.name.split(".")[1]
                }`}
                alt="post img"
              />
            </div>
            <div className="post__wrapper">
              <div className="user__info">
                <img
                  src="data:image/jpeg;base64,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"
                  alt=""
                />
                <div className="user__special">
                  <h3>
                    {data?.user?.first_name} {data?.user?.last_name}
                  </h3>
                  <p>
                    Posted on <span>{data?.createdAt?.split('T')[0]}</span>
                  </p>
                </div>
              </div>
              <h1 className="post__title">
                {data?.title}
              </h1>
              <p className="category_name">{data?.category?.name} (#{data?.tags?.map((res) => (
                res
              ))})</p>
              <p className="post__body">
                {data?.description}
              </p>
            </div>
      </div>
    </section>
  );
};

export default PostPage;
