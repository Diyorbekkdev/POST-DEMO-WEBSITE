import PropTypes from "prop-types";
import { Image } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { useContext, useEffect} from "react";
import { request } from "../../../../server/request";
import { MainContext } from "../../../../context/MainContext";
import { useNavigate } from "react-router-dom";
import { IMG_URl } from "../../../../const";
//slider
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// style
import "./popularCard.scss";

const PopularCard = () => {
  const navigate = useNavigate();
  const {popularPost, setPopularPost,  setPostId} = useContext(MainContext)

  useEffect(() => {
    request.get("post/lastones").then((response) => {
      setPopularPost(response.data);
    });
  }, [setPopularPost]);

  if (!popularPost) return null;

  const breakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 50,
    },
  };

  const getPostId = (id) => {
    setPostId(id)
    navigate(`posts/${id}`);
  };

  return (
    <div className="card_row">
      <Swiper
        spaceBetween={50}
        breakpoints={breakpoints}
        pagination={{ clickable: true }}
      >
        {popularPost.map((card) => (
          <SwiperSlide key={card.id} className="card">
            <div className="img_container">
              <Image
                className="img"
                src={`${IMG_URl + card?.photo?._id}.${
                  card?.photo?.name.split(".")[1]
                }`}
              />
            </div>
            <div className="pathToOwnPage" onClick={() => getPostId(card._id)}>
              <p className="card_user">
                By <span>{card.user.first_name}</span>{" "}
                {card.createdAt.split("T")[0]}{" "}
              </p>
              <h2>{card.title}</h2>
              <p className="info_text">{card.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// PropTypes definition
PopularCard.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PopularCard;
