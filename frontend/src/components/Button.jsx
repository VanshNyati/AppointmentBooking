export default function Button({
  as: As = "button",
  className = "",
  ...props
}) {
  return <As className={`btn-primary ${className}`} {...props} />;
}
