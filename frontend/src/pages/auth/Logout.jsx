import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

export default function Logout() {

  const nav = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    
    // Clear Redux state
    dispatch(logout());
    
    // Navigate to home
    nav("/");
  };

  return (
    <div style={{ padding: "50px" }}>

      <h2>Are you sure?</h2>

      <button onClick={handleLogout}>
        Yes Logout
      </button>

    </div>
  );
}
