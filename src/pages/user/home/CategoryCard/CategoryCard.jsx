import { useContext, useEffect, useState } from "react";
import { CategoryBreakpoints } from "./responsive-carousel";
import { Swiper, SwiperSlide } from "swiper/react";
import { request } from "../../../../server/request";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../../../context/MainContext";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// style
import "./categoryCard.scss";



const CategoryCard = () => {
  const navigate = useNavigate();
  const {setCategoryId} = useContext(MainContext);
  const [post, setPost] = useState(null);
  useEffect(() => {
    request.get('category').then((response) => {
      setPost(response.data);
    });
  }, []);

 const getCategoryId = (id) => {
      setCategoryId(id)
      navigate(`category/${id}`)
 }
 
    if (!post) return null;
  return (
    <div className="card__row">
      <Swiper
        spaceBetween={50}
        breakpoints={CategoryBreakpoints}
        pagination={{ clickable: true }}
        autoplay={true}
      >
        {post.data.map((res) => (
          <SwiperSlide key={res.id} className="category_card" onClick={() => getCategoryId(res._id)}>
            <div
              className="img__container"
              style={{ background: `url("https://t4.ftcdn.net/jpg/00/81/38/59/360_F_81385977_wNaDMtgrIj5uU5QEQLcC9UNzkJc57xbu.jpg") center center, no-repeat`,backgroundSize:"cover" }}
            ></div>
            <h3 className="card__title">{res.name}</h3>
            <p className="card_info">{res.description}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryCard;
