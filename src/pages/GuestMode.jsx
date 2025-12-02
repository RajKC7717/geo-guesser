import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GuestMode = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const guestID = `Guest${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem("ign", guestID);
    navigate("/dashboard");
  }, [navigate]);

  return null; // No UI needed, instant redirection
};

export default GuestMode;
