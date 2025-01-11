//this file handles the custom hook to pass down the user login details
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const { user, setUser } = context;

  return { user, setUser };
};

