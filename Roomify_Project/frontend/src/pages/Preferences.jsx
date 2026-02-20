// import { useState } from "react";

// const preferencesList = [
//   { label: "Vegan", emoji: "🌱" },
//   { label: "Fitness Freak", emoji: "🏋️" },
//   { label: "Non Alcoholic", emoji: "🍺" },
//   { label: "Music Lover", emoji: "🎵" },
//   { label: "Gamer", emoji: "🎮" },
//   { label: "Non Smoker", emoji: "🚭" },
//   { label: "Non Vegetarian", emoji: "🍗" },
//   { label: "Dancer", emoji: "💃" },
//   { label: "Party Lover", emoji: "🥳" },
//   { label: "Movie Lover", emoji: "🎬" },
// ];

// export default function Preferences() {
//   const [selectedPrefs, setSelectedPrefs] = useState([]);

//   const togglePreference = (label) => {
//     if (selectedPrefs.includes(label)) {
//       setSelectedPrefs(selectedPrefs.filter((item) => item !== label));
//     } else {
//       setSelectedPrefs([...selectedPrefs, label]);
//     }
//   };

//   const submitPreferences = () => {
//     if (selectedPrefs.length < 5) {
//       alert("Please select at least 5 preferences.");
//       return;
//     }

//     alert("Selected Preferences:\n" + selectedPrefs.join(", "));

//     // Example backend call
//     /*
//     fetch("/api/preferences", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(selectedPrefs),
//     });
//     */
//   };

//   return (
//     <div style={styles.page}>
//       {/* Header */}
//       <header style={styles.header}>
//         <div style={styles.logo}>Roomify.</div>
//         <div style={styles.headerRight}>
//           <button style={styles.addBtn}>+ Add Listing</button>
//           <div style={styles.avatar}></div>
//         </div>
//       </header>

//       {/* Main */}
//       <div style={styles.container}>
//         <h1>Set Your Preferences</h1>
//         <p>
//           It will show what kind of flatmate you prefer.
//           <br />
//           Please select at least 5 preferences to update.
//         </p>

//         <div style={styles.grid}>
//           {preferencesList.map((pref) => (
//             <div
//               key={pref.label}
//               onClick={() => togglePreference(pref.label)}
//               style={{
//                 ...styles.card,
//                 ...(selectedPrefs.includes(pref.label)
//                   ? styles.selected
//                   : {}),
//               }}
//             >
//               <span style={{ fontSize: "34px" }}>{pref.emoji}</span>
//               <p>{pref.label}</p>
//             </div>
//           ))}
//         </div>

//         <button style={styles.submitBtn} onClick={submitPreferences}>
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     fontFamily: "Poppins, sans-serif",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "25px 60px",
//   },
//   logo: {
//     fontSize: "28px",
//     fontWeight: "600",
//   },
//   headerRight: {
//     display: "flex",
//     alignItems: "center",
//     gap: "20px",
//   },
//   addBtn: {
//     background: "#e6f76b",
//     border: "none",
//     padding: "10px 18px",
//     borderRadius: "25px",
//     cursor: "pointer",
//     fontWeight: "500",
//   },
//   avatar: {
//     width: "42px",
//     height: "42px",
//     borderRadius: "50%",
//     background: "#ddd",
//   },
//   container: {
//     maxWidth: "1100px",
//     margin: "40px auto",
//     textAlign: "center",
//     padding: "0 20px",
//   },
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
//     gap: "35px",
//     justifyItems: "center",
//     marginTop: "40px",
//   },
//   card: {
//     width: "140px",
//     height: "140px",
//     background: "#f3f3f3",
//     borderRadius: "50%",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//     transition: "all 0.25s ease",
//     border: "3px solid transparent",
//   },
//   selected: {
//     background: "#e9fff1",
//     border: "3px solid #4cd964",
//     transform: "scale(1.05)",
//   },
//   submitBtn: {
//     marginTop: "50px",
//     padding: "14px 45px",
//     fontSize: "16px",
//     borderRadius: "30px",
//     border: "none",
//     cursor: "pointer",
//     background: "#9fe7b8",
//     fontWeight: "500",
//   },
// };





import { useState, useEffect } from "react";
import "./Preferences.css";

const preferencesList = [
  { label: "Vegan", emoji: "🌱" },
  { label: "Fitness Freak", emoji: "🏋️" },
  { label: "Non Alcoholic", emoji: "🍺" },
  { label: "Music Lover", emoji: "🎵" },
  { label: "Gamer", emoji: "🎮" },
  { label: "Non Smoker", emoji: "🚭" },
  { label: "Non Vegetarian", emoji: "🍗" },
  { label: "Dancer", emoji: "💃" },
  { label: "Party Lover", emoji: "🥳" },
  { label: "Movie Lover", emoji: "🎬" },
];

export default function Preferences() {
  const [selectedPrefs, setSelectedPrefs] = useState([]);

  
  useEffect(() => {
    const saved = localStorage.getItem("roomifyPreferences");
    if (saved) {
      setSelectedPrefs(JSON.parse(saved));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem(
      "roomifyPreferences",
      JSON.stringify(selectedPrefs)
    );
  }, [selectedPrefs]);

  const togglePreference = (label) => {
    if (selectedPrefs.includes(label)) {
      setSelectedPrefs(selectedPrefs.filter((item) => item !== label));
    } else {
      setSelectedPrefs([...selectedPrefs, label]);
    }
  };

  const submitPreferences = () => {
    if (selectedPrefs.length < 5) return;
    alert("Preferences Saved Successfully 🎉");
  };

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <div className="logo">Roomify.</div>
        <div className="header-right">
          <button className="add-btn">+ Add Listing</button>
          <div className="avatar"></div>
        </div>
      </header>

      {/* Main */}
      <div className="container">
        <h1>Set Your Preferences</h1>
        <p>
          It will show what kind of flatmate you prefer.
          <br />
          Please select at least 5 preferences to update.
        </p>

        {/* 🔢 Live Count */}
        <div className="count">
          Selected: <span>{selectedPrefs.length}</span> / 5
        </div>

        <div className="grid">
          {preferencesList.map((pref) => (
            <div
              key={pref.label}
              onClick={() => togglePreference(pref.label)}
              className={`card ${
                selectedPrefs.includes(pref.label) ? "selected" : ""
              }`}
            >
              <span className="emoji">{pref.emoji}</span>
              <p>{pref.label}</p>
            </div>
          ))}
        </div>

        <button
          className={`submit-btn ${
            selectedPrefs.length >= 5 ? "active" : ""
          }`}
          disabled={selectedPrefs.length < 5}
          onClick={submitPreferences}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

