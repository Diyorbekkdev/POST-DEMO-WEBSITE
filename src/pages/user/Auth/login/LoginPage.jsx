import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { request } from "../../../../server/request";
import { EXPIRE_DATE, ROLE, TOKEN } from "../../../../const/index";
import { AuthContext } from "../../../../context/AuthContext";

import './login.scss';
import { Spin } from "antd";
const LoginPage = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let {
        data: { token, expire, role },
      } = await request.post("auth/login", user);
      setIsAuthenticated(true);
      if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "user") {
        navigate("/my-posts");
      }
      Cookies.set(TOKEN, token);
      Cookies.set(ROLE, role);
      Cookies.set(EXPIRE_DATE, expire);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="login">
      <div className="container">
        <h1>Login In</h1>
        <div className="form__wrapper">
          {loading ? (
            <div className="login_wrap">
              <Spin/>
            </div>
          ) : (
            <form className="form" onSubmit={submit}>
              <input
                type="text"
                onChange={handleChange}
                value={user.username}
                placeholder="Username"
                name="username"
              />
              <input
                type="text"
                onChange={handleChange}
                value={user.password}
                placeholder="Password"
                name="password"
              />
              <button className="login_btn" type="submit">Login</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
