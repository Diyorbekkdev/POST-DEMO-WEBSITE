import { Image } from "antd";

import './myposts.scss';
const AllPostsCard = ({title, category, info, onClick, img}) => {
  return (
    <div className="card">
        <div className="postimg_container">
            <Image className="img" src={img}/>
        </div>
        <div onClick={onClick} className="card_info">
            <p className="name">{category}</p>
            <h2 className="title">{title}</h2>
            <p>{info}</p>
        </div>
    </div>
  )
}
export default AllPostsCard