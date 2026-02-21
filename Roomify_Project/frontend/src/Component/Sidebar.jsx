import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">

      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/profile">Profile</NavLink>
      <NavLink to="/find">Find Roommate</NavLink>
      <NavLink to="/requests">Requests</NavLink>
      <NavLink to="/subscribe">Chat</NavLink>

    </div>
  );
}

export default Sidebar;
