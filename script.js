const WORD_CATEGORIES = {


  animal: [
    { word: "dog", hint: "Known as man's best friend" },
    { word: "cat", hint: "A small pet that says meow" },
    { word: "elephant", hint: "Largest land animal with a trunk" },
    { word: "lion", hint: "Called the king of the jungle" },
    { word: "monkey", hint: "Loves bananas and climbs trees" }
  ],

  bird: [
    { word: "sparrow", hint: "A small bird commonly seen near homes" },
    { word: "parrot", hint: "A colorful bird that can mimic speech" },
    { word: "crow", hint: "A black bird known for intelligence" },
    { word: "eagle", hint: "A bird with very sharp eyesight" },
    { word: "peacock", hint: "India’s national bird with colorful feathers" }
  ],

  vehicle: [
    { word: "car", hint: "A four-wheeled road vehicle" },
    { word: "bus", hint: "Public transport that carries many people" },
    { word: "train", hint: "Runs on tracks and stops at stations" },
    { word: "bicycle", hint: "A two-wheeled vehicle powered by pedaling" },
    { word: "ship", hint: "A large vehicle that travels on water" }
  ],

  fruit: [
    { word: "apple", hint: "A round fruit that keeps the doctor away" },
    { word: "banana", hint: "A long yellow fruit rich in potassium" },
    { word: "mango", hint: "The king of fruits in summer" },
    { word: "orange", hint: "A citrus fruit rich in vitamin C" },
    { word: "grapes", hint: "Small fruits that grow in bunches" }
  ],

  vegetable: [
    { word: "carrot", hint: "An orange vegetable good for eyesight" },
    { word: "potato", hint: "A vegetable commonly used to make fries" },
    { word: "tomato", hint: "A red vegetable often used in sauces" },
    { word: "onion", hint: "A vegetable that can make you cry" },
    { word: "spinach", hint: "A green leafy vegetable rich in iron" }
  ],

  clothes: [
    { word: "shirt", hint: "Upper body clothing with buttons" },
    { word: "pants", hint: "Lower body clothing with two legs" },
    { word: "jacket", hint: "Outerwear used in cold weather" },
    { word: "hat", hint: "Worn on the head for style or protection" },
    { word: "shoes", hint: "Footwear worn in pairs" }
  ],

  weather: [
    { word: "rain", hint: "Water falling from clouds" },
    { word: "sunny", hint: "Bright weather with visible sun" },
    { word: "cloudy", hint: "Sky covered with clouds" },
    { word: "storm", hint: "Weather with strong wind and rain" },
    { word: "fog", hint: "Thick mist that reduces visibility" }
  ],

  jobs: [
    { word: "doctor", hint: "A person who treats sick people" },
    { word: "teacher", hint: "A person who educates students" },
    { word: "police", hint: "Maintains law and order" },
    { word: "chef", hint: "A professional cook" },
    { word: "pilot", hint: "Flies airplanes" }
  ],

  sports: [
    { word: "football", hint: "A sport played mainly with the feet" },
    { word: "cricket", hint: "A bat-and-ball sport popular in India" },
    { word: "tennis", hint: "A racket sport played over a net" },
    { word: "hockey", hint: "A team sport played with sticks" },
    { word: "badminton", hint: "A racket sport played with a shuttlecock" }
  ],

  insects: [
    { word: "ant", hint: "A tiny insect that lives in colonies" },
    { word: "bee", hint: "An insect that makes honey" },
    { word: "butterfly", hint: "An insect with colorful wings" },
    { word: "mosquito", hint: "An insect that bites and buzzes" },
    { word: "spider", hint: "An eight-legged creature that spins webs" }
  ]
};
const words = WORD_CATEGORIES;

function getNextImage(category, word) {
  const cycle = categoryCycleTracker[category] || 0;
  const key = `${category}_${word}_cycle_${cycle}`;
  const totalImages = 3;

  let newIndex;

  do {
    newIndex = Math.floor(Math.random() * totalImages) + 1;
  } while (imageIndexTracker[key] === newIndex && totalImages > 1);

  imageIndexTracker[key] = newIndex;

  return `assets/images/${category}/${word}${newIndex}.png`;
}


const imageIndexTracker = {};
const hintIndexTracker = {};
const categoryCycleTracker = {};



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
  const pool = words[currentCategory];

  // Initialize trackers if not present
  if (hintIndexTracker[currentCategory] === undefined) {
    hintIndexTracker[currentCategory] = 0;
    categoryCycleTracker[currentCategory] = 0;
  }

  const index = hintIndexTracker[currentCategory];
  const entry = pool[index];

  selectedWord = entry.word;
  selectedHint = entry.hint;

  // Move to next hint
  hintIndexTracker[currentCategory]++;

  // If all 5 hints are done, reset & increase cycle
  if (hintIndexTracker[currentCategory] >= pool.length) {
    hintIndexTracker[currentCategory] = 0;
    categoryCycleTracker[currentCategory]++;
  }
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

 const imgSrc = getNextImage(currentCategory, selectedWord);
const img = document.getElementById("wordImage");

img.onerror = () => {
  console.error("Image failed to load:", imgSrc);
};

img.src = imgSrc;
document.getElementById("imageBox").classList.remove("hidden");


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
  document.getElementById("imageBox").classList.add("hidden");

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



