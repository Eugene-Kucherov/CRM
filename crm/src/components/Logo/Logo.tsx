import "./logo.scss";

interface LogoProps {
  size: "sm" | "lg";
}

function Logo({ size }: LogoProps) {
  return <div className={`logo ${size}`}>Nordlicht</div>;
}

export default Logo;
