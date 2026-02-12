import Sidebar from "../components/Sidebar";

export default function Chat() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ padding: "30px" }}>
        <h1>Chat</h1>
        <p>Subscribe to chat</p>
      </div>
    </div>
  );
}
