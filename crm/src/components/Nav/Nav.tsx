import { Link, useLocation } from "react-router-dom";
import "./nav.scss";
import LogoutButton from "../LogoutButton/LogoutButton";
import Logo from "../Logo/Logo";
import useTranslate from "../../hooks/useTranslate";
import Settings from "../Settings/Settings";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const navItems = [
  { text: "personal", icon: <PersonIcon />, link: "/personal" },
  { text: "calendar", icon: <EventIcon />, link: "/calendar" },
  { text: "deals", icon: <MonetizationOnIcon />, link: "/deals" },
  { text: "messages", icon: <ChatBubbleOutlineIcon />, link: "/messages" },
];

interface NavProps {}

const Nav = (props: NavProps) => {
  const { t } = useTranslate();
  const location = useLocation();

  const isActiveLink = (pathname: string) => {
    return location.pathname.includes(pathname) ? "active" : "";
  };

  return (
    <nav className="nav">
      <Link to="/">
        <Logo size="sm" />
      </Link>
      <ul className="nav-list">
        {navItems.map((item) => (
          <li
            key={item.link}
            className={`nav-list__item ${isActiveLink(item.link)}`}
          >
            <Link to={item.link}>
              {item.icon} {t(item.text)}
            </Link>
          </li>
        ))}
      </ul>
      <div className="nav-actions">
        <Settings />
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Nav;
