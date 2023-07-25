import "./button.scss"; // Import the SCSS file to apply styles
import PropTypes from 'prop-types';

const MyPostButton = ({ text, color, onClick }) => {
  return (
    <button className={`button ${color}`} onClick={onClick}>
      {text}
    </button>
  );
};

MyPostButton.propTypes = {
  text: PropTypes.string.isRequired, 
  color: PropTypes.string,
  onClick: PropTypes.func, 
};
export default MyPostButton;
