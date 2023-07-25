import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
const NotFoundPage = () => {
  const navigate = useNavigate();
  const goHomePage = () => {
    navigate('/')
  }
  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button onClick={goHomePage} type="primary">Back Home</Button>}
      />
    </div>
  );
};

export default NotFoundPage;
