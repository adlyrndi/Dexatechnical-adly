export const Card = ({ children, className = "", style = {} }) => (
  <div className={`glass-card ${className}`} style={style}>{children}</div>
);
export default Card;
