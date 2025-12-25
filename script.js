const words = {
  animals: [
    { word: "elephant", hint: "Largest land animal" },
    { word: "tiger", hint: "Striped wild cat" },
    { word: "giraffe", hint: "Animal with a very long neck" },
    { word: "lion", hint: "Known as the king of the jungle" },
    { word: "zebra", hint: "Black and white striped animal" },
    { word: "kangaroo", hint: "Animal that jumps and has a pouch" }
  ],
  fruits: [
    { word: "banana", hint: "Yellow and curved fruit" },
    { word: "apple", hint: "Keeps the doctor away" },
    { word: "orange", hint: "Citrus fruit rich in vitamin C" },
    { word: "mango", hint: "Known as the king of fruits" },
    { word: "grapes", hint: "Small fruits that grow in bunches" },
    { word: "papaya", hint: "Orange fruit good for digestion" }
  ],
  sports: [
    { word: "cricket", hint: "Very popular in India" },
    { word: "football", hint: "Played mainly using feet" },
    { word: "tennis", hint: "Played with a racket" },
    { word: "hockey", hint: "Played with a stick and ball" },
    { word: "basketball", hint: "Played using a hoop" },
    { word: "badminton", hint: "Played with a shuttlecock" }
  ]
};

let selectedWord = "";
let selectedHint = "";
let attemptsLeft = 5;
let lastWord = "";
let currentCategory = "";

function startGame() {
  const category = document.getElementById("category").value;
  if (!category) {
    alert("Please select a category");
    return;
  }

  currentCategory = category;
  pickNewWord();

  attemptsLeft = 5;
  document.getElementById("hint").innerText = "Hint: " + selectedHint;
  document.getElementById("gameArea").classList.remove("hidden");
  document.getElementById("result").innerText = "";
  document.getElementById("similarity").innerText = "";
  document.getElementById("guessInput").value = "";
  document.getElementById("guessInput").disabled = false;
  document.getElementById("playAgainBtn").classList.add("hidden");

  updateAttempts();
}

function pickNewWord() {
  let pool = words[currentCategory];
  let newEntry;

  do {
    newEntry = pool[Math.floor(Math.random() * pool.length)];
  } while (newEntry.word === lastWord && pool.length > 1);

  selectedWord = newEntry.word;
  selectedHint = newEntry.hint;
  lastWord = selectedWord;
}

function checkGuess() {
  const guess = document.getElementById("guessInput").value.toLowerCase();
  if (!guess) return;

  attemptsLeft--;

  const score = similarityScore(guess, selectedWord);
  document.getElementById("similarity").innerText =
    "Similarity Score: " + score.toFixed(2);

  if (guess === selectedWord) {
    document.getElementById("result").innerText =
      "🎉 Correct! You guessed it!";
    endGame();
    return;
  }

  if (attemptsLeft <= 0) {
    document.getElementById("result").innerText =
      "❌ Game Over! The word was: " + selectedWord;
    endGame();
    return;
  }

  document.getElementById("result").innerText =
    "❗ Wrong guess, try again!";
  updateAttempts();
}

function endGame() {
  document.getElementById("guessInput").disabled = true;
  document.getElementById("playAgainBtn").classList.remove("hidden");
}

function playAgain() {
  startGame();
}

function updateAttempts() {
  document.getElementById("attempts").innerText =
    "Attempts left: " + attemptsLeft;
}

function similarityScore(guess, target) {
  guess = guess.toLowerCase();
  target = target.toLowerCase();

  let matches = 0;
  let targetArr = target.split("");

  for (let char of guess) {
    let index = targetArr.indexOf(char);
    if (index !== -1) {
      matches++;
      targetArr.splice(index, 1); // remove matched char
    }
  }

  return matches / Math.max(target.length, guess.length);
}

