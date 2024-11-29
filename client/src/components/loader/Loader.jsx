import "./loader.css";

const Loader = ({ width, height, border, borderLeftColor }) => {
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
