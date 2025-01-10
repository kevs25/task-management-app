import { useLocation, useNavigate } from "react-router-dom";

import NavBar from "./NavBar";
import { useUser } from "../hooks/useUser";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); 
  useEffect(() => {
    if (!user) {
      navigate("/");  
    }
  }, [user, navigate]);
  if (!user) return null; 
  const username = location.state?.username || "User"; 
  const profilePhoto = location.state?.profilePhoto || "ProfilePicture"
  
  return (
    <NavBar username={username} profilePhoto={profilePhoto}/>
  );
}
