export const Button = ({ children, variant = "primary", className = "", ...props }) => (
  <button className={`${variant === "primary" ? "btn-primary" : "btn-ghost"} ${className}`} {...props}>{children}</button>
);
export default Button;
