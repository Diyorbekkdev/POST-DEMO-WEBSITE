import { Button, Image } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FundViewOutlined,
} from "@ant-design/icons";
import "./cardstyle.scss";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../context/MainContext";
import { ENDPOINT, IMG_URl, LIMIT } from "../../const";
import  {request}  from "../../server/request";
const MyPostCards = () => {
  const { setSearch, categories, search, page, total, setTotal, uploadedImage } = useContext(MainContext);
  const [myPosts, setMyPosts] = useState([]); 
  const getPosts = async () => {
    try {
      let { data } = await request.get(
        `post/user?page=${page}&limit=${LIMIT}${search}`
      );
      setMyPosts(data?.data);
      setTotal(data.pagination.total);

    } catch (err) {
      console.log(err);
    }
  };
console.log(myPosts);
  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="ownPosts__Card__Wrapper">
      {myPosts.map((res) => (<div key={res._id} className="card">
        <div className="postimg_container">
          {console.log(res.photo.name.split(".")[1])}
          {res.photo._id ? <Image
            className="img"
            src={`${IMG_URl + res?.photo?._id}.${res?.photo?.name.split(".")[1]}`}
          /> : "No img herer"}
        </div>
        <div  className="card_information">
          <div className="ownPost_info">
            <p className="name">{res?.category?.name}</p>
            <h2 className="title">{res?.title}</h2>
            <p>{res?.description}</p>
          </div>
          <div className="own_post_buttons">
            <Button type="primary" size="large" icon={<FundViewOutlined />}>
              See Post
            </Button>
            <Button type="primary" size="large" icon={<EditOutlined />}>
              Edit Post
            </Button>
            <Button
              type="primary"
              size="large"
              danger
              icon={<DeleteOutlined />}
            >
              Delete Post
            </Button>
          </div>
        </div>
      </div>))}
    </div>
  );
};
export default MyPostCards;
