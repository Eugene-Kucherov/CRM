import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setName, setProfilePhoto } from "../store/initialsSlice";
import useFetch from "./useFetch";
import { IProfilePhoto, IUserDetails } from "../types";

const useInitials = () => {
  const userId = JSON.parse(localStorage.getItem("userId")!);
  const dispatch = useDispatch();
  const getUser = useFetch("get", `/users/${userId}`);
  const getPhoto = useFetch("get", `/photos/${userId}`);
  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser: IUserDetails = await getUser();
      dispatch(setName(fetchedUser?.name));
      if (userId) {
        const fetchedPhoto: IProfilePhoto = await getPhoto();
        dispatch(setProfilePhoto(fetchedPhoto));
      }
    };
    fetchUser();
  }, []);

  return null;
};

export default useInitials;
