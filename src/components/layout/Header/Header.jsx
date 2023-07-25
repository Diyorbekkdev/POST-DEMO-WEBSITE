import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";

import Button from "../../Button/Button";
import logo from "../../../assets/images/news (1).png";

// style importing
import "./header.scss";
import { AuthContext } from "../../../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(0);
  const [underlineStyle, setUnderlineStyle] = useState({});
  let { isAuthenticated } = useContext(AuthContext);

  const words = ["News", "Wave"];
  const authWords = ["My", "Blog"];
   

  const handleAnimation = useCallback(() => {
    setAnimate((prev) => (prev + 1) % words.length);
  }, [words.length]);

  useEffect(() => {
    const interval = setInterval(handleAnimation, 3000);
    return () => clearInterval(interval);
  }, [handleAnimation]);

  const handleLinkHover = (e) => {
    const linkElement = e.target;
    const linkPosition = linkElement.getBoundingClientRect();
    const containerPosition = linkElement.parentElement.getBoundingClientRect();
    const underlineOffset = linkPosition.right - containerPosition.left;
    setUnderlineStyle({
      transform: `translateX(${underlineOffset - 82}px)`,
    });
    console.log(containerPosition);
  };

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("account");
    } else {
      navigate("login");
    }
  };
  return (
    <header className="header">
      <nav className="header__nav container">
        <Link to={`${isAuthenticated ? "/my-posts" : '/'}`} className="header__nav--logo">
          <img src={logo} alt="logo" />
          <h1>
            {isAuthenticated ? authWords.map((word, index) => (
              <span
                key={index}
                className={index === animate ? "animate-color" : ""}
              >
                {word}
              </span>
            )) : words.map((word, index) => (
              <span
                key={index}
                className={index === animate ? "animate-color" : ""}
              >
                {word}
              </span>
            ))}
          </h1>
        </Link>
        <div className="header__nav--list">
          <ul className="nav_list">
            <li
              className="navbar__item"
              onMouseEnter={handleLinkHover}
              onMouseLeave={() => setUnderlineStyle({})}
            >
              <NavLink to="/">Home</NavLink>
              <ul className="dropdown container">
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Corporis ad in aut consequuntur suscipit sunt voluptas ea
                  iusto debitis, repellat ipsa rerum totam delectus illum
                  eveniet unde, nisi, est sint.
                </p>
              </ul>
            </li>
            <li
              className="navbar__item"
              onMouseEnter={handleLinkHover}
              onMouseLeave={() => setUnderlineStyle({})}
            >
              <NavLink to="/posts">Bolog</NavLink>
              <ul className="dropdown container">
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Corporis ad in aut consequuntur suscipit sunt voluptas ea
                  iusto debitis, repellat ipsa rerum totam delectus illum
                  eveniet unde, nisi, est sint.
                </p>
              </ul>
            </li>
            <li
              className="navbar__item"
              onMouseEnter={handleLinkHover}
              onMouseLeave={() => setUnderlineStyle({})}
            >
              <NavLink to="/about">About Us</NavLink>
            </li>
            <li
              className="navbar__item"
              onMouseEnter={handleLinkHover}
              onMouseLeave={() => setUnderlineStyle({})}
            >
              <NavLink to="/register">Register</NavLink>
            </li>
            <div className="navbar__underline" style={underlineStyle}></div>
          </ul>
          <Button
            text={isAuthenticated ? "Account" : "Login"}
            onClick={handleClick}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
