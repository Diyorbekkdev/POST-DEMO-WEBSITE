import "./DarkMode.scss";

const DarkMode = () => {
    const switchOn = () =>{
        document.body.classList.toggle("dark")
    }
  return (
    <div className="container">
      <div onClick={switchOn} className="check_box">
        <label>
          <input value="on" name="dummy" type="checkbox" className="bubble" />
        </label>
      </div>
    </div>
  );
};

export default DarkMode;
