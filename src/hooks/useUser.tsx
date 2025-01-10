// import { useState, useEffect } from "react";
// import { User } from "../Types/user";
// export const useUser = () => {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     // Check if there's a user in localStorage
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser)); // Set user from localStorage if available
//     }
//   }, []);

//   return { user, setUser };
// };


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

