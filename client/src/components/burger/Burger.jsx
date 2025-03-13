import "./burger.css";

const Burger = ({ isOpen, onClick }) => {
  return (
    <div className={`burger ${isOpen ? "open" : ""}`} onClick={onClick}>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  );
};

export default Burger;
