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
  const { quizzes } = await fetch("/assets/json/data.json").then((x) => x.json());

  document.querySelectorAll(".quizTypeButton").forEach((element) => {
    element.addEventListener("click", quizTypeButtonHandle);
  });

  function quizTypeButtonHandle() {
    const quizType = this.getAttribute("data-id");
    const questions = quizzes.find((x) => x.title == quizType);
    if (quizType === "HTML") {
      startQuiz(questions);
    } else if (quizType === "CSS") {
      startQuiz(questions);
    } else if (quizType === "JavaScript") {
      startQuiz(questions);
    } else if (quizType === "Erişilebilirlik") {
      startQuiz(questions);
    }
  }
}

init();

function startQuiz(quizzes) {
  console.log(quizzes);
}
