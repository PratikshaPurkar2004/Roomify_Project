// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Header() {

//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="app-header">

//       <div className="logo">🏠 Roomify</div>

//       <div className="user-area">

//         {/* Default Circle Avatar */}
//         <div
//           className="avatar"
//           onClick={() => setOpen(!open)}
//           style={{
//             background: "#2563eb",
//             color: "white",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontWeight: "bold"
//           }}
//         >
//           U
//         </div>

//         {open && (
//           <div className="dropdown">

//             <button onClick={() => navigate("/profile")}>
//               Profile
//             </button>

//             <button onClick={() => navigate("/")}>
//               Logout
//             </button>

//           </div>
//         )}

//       </div>

//     </header>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="app-header">
      <div className="logo">🏠 Roomify</div>

      <div className="user-area">
        {/* Default Avatar Circle */}
        <div
          className="avatar"
          onClick={() => setOpen(!open)}
          style={{
            background: "#2563eb",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          U
        </div>

        {open && (
          <div className="dropdown">
            <button onClick={() => navigate("/profile")}>
              Profile
            </button>

            <button onClick={() => navigate("/")}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
