import { useNavigate } from "react-router-dom";

export default function Logout() {

  const nav = useNavigate();

  return (
    <div style={{ padding: "50px" }}>

      <h2>Are you sure?</h2>

      <button onClick={() => nav("/")}>
        Yes Logout
      </button>

    </div>
  );
}
