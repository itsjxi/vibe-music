import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', fullPage = false }) => {
  const px = { small: 24, medium: 36, large: 52 }[size] || 36;

  return (
    <div className={`kg-spinner-wrap ${fullPage ? 'full-page' : ''}`}>
      <div className="kg-spinner" style={{ width: px, height: px }} />
    </div>
  );
};

export default LoadingSpinner;
