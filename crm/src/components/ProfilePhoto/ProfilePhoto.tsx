import "./profilePhoto.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { api } from "../../API/service";
import useTranslate from "../../hooks/useTranslate";
import { ProfilePhotoType } from "../../pages/PersonalPage/PersonalPage";
import useFetch from "../../hooks/useFetch";
import { Avatar } from "@mui/material";
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";
import CustomButton from "../CustomButton/CustomButton";

interface ProfilePhotoProps {
  userId: string;
  photo: ProfilePhotoType;
  setPhoto: Dispatch<SetStateAction<ProfilePhotoType>>;
  getPhoto: () => Promise<ProfilePhotoType>;
}

const ProfilePhoto = ({
  userId,
  photo,
  setPhoto,
  getPhoto,
}: ProfilePhotoProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { t } = useTranslate();

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
      const fetchedPhoto = await getPhoto();
      setPhoto(fetchedPhoto);
    }
  };

  const handleDeletePhoto = async () => {
    await deletePhoto();
    setSelectedFile(null);
    setPhoto(null);
  };

  return (
    <div className="photo-block">
      {photo ? (
        <div className="photo">
          <img src={photo.photoData} alt="User Photo" />
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
