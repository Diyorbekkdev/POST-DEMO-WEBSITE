import { useEffect, useState } from "react";
import { request } from "../../../../server/request";
import "./register.scss";
import { useNavigate } from "react-router-dom";
import { Input, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setFormData({
      first_name: "",
      last_name: "",
      username: "",
      password: "",
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await request.post("auth/register", formData);
      setLoading(false);
      message.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      console.error("Error registering user:", error);
      message.error("Registration failed. Please try again.");
    }
  };

  return (
    <section className="register">
      <div className="registration-container container">
        <h1 className="register_name">Register</h1>
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name:</label>
            <input
              className="custom_input"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              className="custom_input"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Username:</label>
            <input
              className="custom_input"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <Input.Password
              name="password"
              size="large"
              value={formData.password}
              onChange={handleChange}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="register-btn">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
