import Sidebar from "../components/Sidebar";

export default function Notifications() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ padding: "30px" }}>
        <h1>Notifications</h1>
        <p>No new alerts</p>
      </div>
    </div>
  );
}
