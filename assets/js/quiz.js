const selectedTheme = document.querySelector(".switch");
selectedTheme.addEventListener("change", () => darkMode({ param: selectedTheme.checked })); // * tema butonuna tıklandığında çalışacak işlem

function darkMode({ param = "null" }) {
  if (param == "null") {
    localStorage.setItem("dark-mode", "off"); // * eğer localstroage'de yoksa ekle ve değerini off yap
  } else {
    //* eğer tema checked true ise ve localStorage'de değeri off değil ise dark modu aç değilse kapat
    if (param && param != "off") {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("dark-mode", "on");
    } else {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "off");
    }
  }
  return param;
}

let response;
async function init() {
  const currentTheme = darkMode({ param: localStorage.getItem("dark-mode") });
  // * eğer localstroage'de dark-mode değeri on ise tema switch'ini aktif olarak ayarla
  currentTheme === "on" ? (selectedTheme.checked = true) : (selectedTheme.checked = false); 

  response = await fetch("/assets/json/data.json").then((x) => x.json());

  // * main-page quiz türü butonlarının etkileşimi
  document.querySelectorAll(".quizTypeButton").forEach((element) => {
    element.addEventListener("click", quizTypeButtonHandle);
  });
}
init();


function quizTypeButtonHandle() {
  const quizType = this.getAttribute("data-id"); // * Tıklanan butonun quiz tipi
  const questions = response.quizzes.find((x) => x.title == quizType); // * Tıklanan quizin verileri
  startQuiz(questions); // * quizi başlat
}

let scores = {
  correct: 0,
  incorrect: 0,
};
function startQuiz(quizzes) {
  document.querySelector(".header-title img").src = quizzes.icon; // * Seçilen quizin resmini header'a ekle
  document.querySelector(".header-title h2").innerHTML = quizzes.title; // * Seçilen quizin başlığını header'a ekle
  document.querySelectorAll(".header-title *").forEach((element) => (element.style = "display: inherit")); // * Seçilen quizin başlık bilgilerini görünür yap.
  document.querySelector(".main-page").style = "display: none"; // * main-page'gizle
  document.querySelector(".quiz-page").style = "display: grid"; // * quiz-page' görünür hale getir.
  document.querySelector(".submitNextBtn").innerText = "Sıradaki Soru"; // * Testi bitir yazısını tekrardan eski haline getir.

  // * Skoru sıfırla
  scores = {
    correct: 0,
    incorrect: 0,
  };

  // * Soruları başlat
  getQuestions({
    quizzes: quizzes,
  });
}

function getQuestions({ quizzes = [], index = 0 }) {
  const questions = quizzes.questions; // * Soruları değişkene aktar

  // * Sorular dizisi boş değilse ve şimdiki soru (index) soru sayısından küçük ise çalıştır
  if (questions.length != 0 && index < questions.length) {
    document.querySelector(".quiz-page-header span").innerHTML = `${questions.length} sorudan ${index + 1}.`; // * Şimdiki soru sayısını belirt
    document.querySelector(".quiz-page-header p").innerText = questions[index].question; // * Soruyu ekrana yazdır.
    document.querySelector(".progressStatus").style = `width: ${(index + 1) * 10}%`; // * Progress barı soru sayısına göre paralel olarak arttır.

    let = wordIndex = 0;
    document.querySelector(".quizSectionFormOptions").innerHTML = questions[index].options
      .map((x) => {
        wordIndex++;
        const escapedOption = x.replace(/</g, "&lt;").replace(/>/g, "&gt;"); // * x değerinde eğer HTML etiketi bulunuyorsa onu deaktif et.
        // * convertOptionToWord fonksiyonu şıkların başına harf getirir. escapedOption değişkeni modifiyeli değere sahiptir.
        return `<label><div>${convertOptionToWord(wordIndex - 1)}</div><input type="radio" name="answer" value="${escapedOption}" />${escapedOption}</label>`;
      })
      .join("");
  } else {
    // * Test bitince çalışan kodlar ...
    document.querySelector(".quiz-page").style = "display: none"; // * quiz-page'ı gizle
    document.querySelector(".result-page").style = "display: grid"; // * result-page'ı göster
    document.querySelector(".result-user-score h4").innerHTML = `<img src="${quizzes.icon}" />${quizzes.title}`; // * result-page quiz tipi bilgilerini yazdır.
    document.querySelector(".result-user-score h1").innerText = scores.correct; // * Skoru ekrana yazdır
    document.querySelector(".result-user-score span").innerText = `${questions.length} soruda`; // * Soru miktarını ekrana yazdır.
    
    // * Testi baştan başlatır.
    document.querySelector(".playAgainBtn").onclick = (e) => {
      e.preventDefault();
      document.querySelector(".result-page").style = "display: none"; // * result-page'ı gizle
      document.querySelector(".main-page").style = "display: grid"; // * main-page'ı göster
    };
  }

  // * Cevabı gönder butonuna basılınca çalışacak kodlar...
  document.querySelector(".submitAnswer").onclick = (e) => {
    e.preventDefault();
    // * şimdiki soru, soru miktarından küçük ise ve seçili bir cevap var ise
    if (index < questions.length && document.querySelector('input[name="answer"]:checked') != null) {
      document.querySelector(".statusMsg").style = "display: none"; // * StatusMsg'ı gizle
      if (document.querySelector('input[name="answer"]:checked').value === questions[index].answer) {
        // * Eğer cevap doğru ise
        scores.correct++;
        document.querySelector('input[name="answer"]:checked').parentElement.classList.add("correct-answer");
      } else {
        // * Eğer cevap yanlış ise
        scores.incorrect++;
        document.querySelector('input[name="answer"]:checked').parentElement.classList.add("incorrect-answer");

        // * Doğru cevabı gösterme
        document.querySelectorAll('input[name="answer"]').forEach(element => {
          if (element.value === questions[index].answer) {
            element.parentElement.classList.add("show-correct-answer");
          }
        })
      }

      // * Cevap verildikten sonra seçim yapmayı devre dışı bırak
      document.querySelectorAll('input[name="answer"]').forEach((element) => {
        element.disabled = true;
      });
      document.querySelector(".submitAnswer").style = "display: none"; // * Cevabı gönder butonunu gizle
      document.querySelector(".submitNextBtn").style = "display: inherit"; // * Sıradaki Soru butonunu göster
      if (index + 1 == questions.length) {
        // * Eğer son soru ise Sıradaki Soru butonunun yazısını Testi Bitir'e çevir
        document.querySelector(".submitNextBtn").innerText = "Testi Bitir";
      }
      // * Sıradaki Soru butonuna tıklandığında çalışacak kodlar...
      document.querySelector(".submitNextBtn").onclick = (e) => {
        e.preventDefault();
        document.querySelector(".submitAnswer").style = "display: inherit"; // * Cevabı gönder butonunu göster
        document.querySelector(".submitNextBtn").style = "display: none"; // * Sıradaki Soru butonunu gizle
        getQuestions({ quizzes: quizzes, index: index + 1 }); // * index + 1 ile fonksiyonu sonraki soruya geçerek tekrar çalıştır.
      };
    }else if (document.querySelector('input[name="answer"]:checked') == null){
      // * Eğer seçili cevap yoksa statusMsg'ı göster
      document.querySelector(".statusMsg").style = "display: flex";
    }
  };
}

// * index'in harf karşılığı
const optionToWord = { 0: "A", 1: "B", 2: "C", 3: "D" };

// * İstenilen option'ın harf karşılığını alma
const convertOptionToWord = (option) => optionToWord[option];

// * İstenilen option'ın harf karşılığını alma (Klasik fonksiyon)
// function convertOptionToWord(option) {
//   return optionToWord[option];
// }
