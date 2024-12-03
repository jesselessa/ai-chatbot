import "./loader.css";

const Loader = ({
  width = "50px",
  height = "50px",
  border = "5px solid transparent",
  borderLeftColor = "white",
}) => {
  return (
    <div
      className="loader"
      style={{
        width,
        height,
        border,
        borderLeftColor,
      }}
    ></div>
  );
};

export default Loader;
