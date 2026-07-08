import React, { useEffect, useState } from "react";

function ThemeToggle() {

  const [theme, setTheme] = useState("light");

  // Load theme on start
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        border: "none",
        background: "transparent",
        fontSize: "20px",
        cursor: "pointer"
      }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

export default ThemeToggle;