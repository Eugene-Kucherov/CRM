import "./profileInfo.scss";
import { Avatar } from "@mui/material";
import { InitialsState } from "../../store/initialsSlice";

const ProfileInfo = ({ profilePhoto, name }: InitialsState) => {
  return (
    <div className="profile-info">
      <div className="small-photo">
        {profilePhoto ? (
          <img src={profilePhoto.photoData} alt="Profile Photo" />
        ) : (
          <Avatar alt="User Photo" className="avatar" />
        )}
      </div>
      {name && <span className="name">{name}</span>}
    </div>
  );
};

export default ProfileInfo;
