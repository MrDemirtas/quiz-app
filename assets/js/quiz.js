const selectedTheme = document.querySelector(".switch");

selectedTheme.addEventListener("change", () => darkMode({ param: selectedTheme.checked }));

function darkMode({ param = "null" }) {
  if (param == "null") {
    localStorage.setItem("dark-mode", "off");
  } else {
    if (param) {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("dark-mode", "on");
    } else {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "off");
    }
    return param;
  }
}

async function init() {
  const currentTheme = darkMode({ param: localStorage.getItem("dark-mode") });
  currentTheme === "on" ? (selectedTheme.checked = true) : (selectedTheme.checked = false);
}

init();
