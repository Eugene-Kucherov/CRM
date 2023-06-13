import "./profilePhoto.scss";
import { useState } from "react";
import { api } from "../../API/service";
import useTranslate from "../../hooks/useTranslate";
import { IProfilePhoto } from "../../types";
import useFetch from "../../hooks/useFetch";
import { Avatar } from "@mui/material";
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";
import CustomButton from "../CustomButton/CustomButton";
import { setProfilePhoto } from "../../store/initialsSlice";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store";

interface ProfilePhotoProps {
  userId: string;
}

const ProfilePhoto = ({ userId }: ProfilePhotoProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const profilePhoto = useTypedSelector((state) => state.initials.profilePhoto);

  const getPhoto = useFetch("get", `/photos/${userId}`);
  const deletePhoto = useFetch("delete", `/photos/${userId}`);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUploadPhoto = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("photo", selectedFile);
      await api.post(`/photos/${userId}`, formData);
      const fetchedPhoto: IProfilePhoto = await getPhoto();
      dispatch(setProfilePhoto(fetchedPhoto));
    }
  };

  const handleDeletePhoto = async () => {
    await deletePhoto();
    setSelectedFile(null);
    dispatch(setProfilePhoto(null));
  };

  return (
    <div className="photo-block">
      {profilePhoto ? (
        <div className="photo">
          <img src={profilePhoto.photoData} alt="User Photo" />
        </div>
      ) : (
        <label htmlFor="upload-photo">
          <div className="avatar-placeholder">
            <Avatar alt="User Photo" className="avatar" />
            <AddPhotoIcon className="add-photo-icon" />
          </div>
          <input
            id="upload-photo"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </label>
      )}
      <div className="photo-actions">
        <CustomButton
          className="upload-button"
          onClick={handleUploadPhoto}
          variant="outlined"
        >
          {t("upload_photo")}
        </CustomButton>
        <CustomButton
          className="delete-button"
          onClick={handleDeletePhoto}
          color="error"
          variant="outlined"
        >
          {t("delete_photo")}
        </CustomButton>
      </div>
    </div>
  );
};

export default ProfilePhoto;
