import '../style/Spinner.css';

const Spinner = ({ className = '', children, size = 40, color = '#2D3277' }) => {
  return (
    <div className={`spinner-container ${className}`}>
      <div
        className="spinner"
        style={{
          width: size,
          height: size,
          borderColor: `${color}33`,
          borderTopColor: color,
        }}
      />
      {children && <p className="spinner-text">{children}</p>}
    </div>
  );
};

export default Spinner;