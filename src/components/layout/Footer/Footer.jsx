import { Link } from 'react-router-dom';

import icon1 from '../../../assets/images/1.png'
import icon2 from '../../../assets/images/2.png'
import icon3 from '../../../assets/images/3.png'
import icon4 from '../../../assets/images/4.png'


// style
import './footer.scss';
const Footer = () => {
  return <footer className="footer">
      <div className="container">
        <div className="footer__wrapper">
          <div className="left">
            <p>Finstreet 118 2561 Fintown</p>
            <small>Hello@finsweet.com  020 7993 2905</small>
          </div>
          <div className="right">
              <Link to='https://facebook.com'><img width='25px' src={icon1} alt="facebook" /></Link>
              <Link to='https://instagram.com'><img width='25px' src={icon2} alt="instagram" /></Link>
              <Link to ='https://twitter.com/diyorbek_dev'><img width='25px' src={icon3} alt="twitter" /></Link>
              <Link to='https://www.youtube.com/@diyorbek_dev'> <img width='25px' src={icon4} alt="youtube" /></Link>
          </div>
        </div>
      </div>
  </footer>;
};

export default Footer;
