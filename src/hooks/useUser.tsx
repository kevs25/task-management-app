import { useContext, useEffect } from "react";
import { UserContext } from "../Context/UserContext";

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  const { user, setUser } = context; 

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]); 

  return { user, setUser }; 
};
