"use strict";
let code;

import {
  buildGraph,
  alphabetStats,
  getCharacters,
  button,
} from "./alphabet.js";

import Storage from "./storage.js";
import "/src/CSS/character.css";

let object = {
  start: false,
};


const limitInput = document.querySelector(".limit-count");
const limitReached = document.querySelector(".limit-reached");
const limitCheckbox = document.querySelector("#limit-check");
const sentenceCount = document.querySelector(".sentence-count");
const wordCount = document.querySelector(".word-count");
const characterInput = document.querySelector("#character-input");
const readingTime = document.querySelector(".reading-time");
const wrapper = document.querySelector(".progress-wrapper");
let totalCharacters = document.querySelector("#total-characters");
const statsParagraph = document.querySelector(".stats-paragraph");
const reset = document.querySelector(".reset");

let second = 1000;
let regex = /\w+/g;
let body = document.activeElement;
let string = ["Analyze your text in real-time..."];

const light = new URL(
  "/src/Assets/images/logo-light-theme.svg",
  import.meta.url,
);
const dark = new URL("/src/Assets/images/logo-dark-theme.svg", import.meta.url);

const moon = new URL("/icon-moon.svg", import.meta.url);
const sun = new URL("/src/Assets/images/icon-sun.svg", import.meta.url);

icon.addEventListener("click", () => {
  body.classList.toggle("light-theme");
  if (body.classList.contains("light-theme")) {
    logo.src = light;
    icon.src = moon;
  } else {
    logo.src = dark;
    icon.src = sun;
  }
});

class CharacterStats {
  constructor() {
    this.render();
    this.loadEventListeners();
  }

  loadEventListeners() {
    limitCheckbox.addEventListener("change", this.setLimit.bind(this));
    reset.addEventListener("click", this.resetUI.bind(this));
  }

  handleEvent() {
    characterInput.addEventListener("input", (event) => {
      this.totalCharacters(event);
      this.wordCount(event);
      this.sentenceCount(event);
    });
  }

  totalCharacters(event) {
    let totalCount = 0;
    let input = event.target.value;
    totalCount += input.length;
    totalCharacters.innerText = totalCount;

    localStorage.clear();
    let total = Storage.addCharactersToStorage(totalCount);

    spaces.addEventListener("change", (event) => {
      let isChecked = event.target.checked;

      let excludeSpaces = totalCount - this.countSpace();
      if (isChecked) {
        totalCharacters.innerText = excludeSpaces;
      } else {
        totalCharacters.innerText = totalCount;
      }

      if (characterInput.value == "") totalCharacters.innerText = "00";
    });

    if (totalCount >= this.setLimit()) {
      limitReached.classList.add("show");
      characterInput.classList.add("limit");
    } else if (totalCount <= this.setLimit()) {
      limitReached.classList.remove("show");
      characterInput.classList.remove("limit");
    }

    try {
      object.start = totalCount === 10;
      if (object.start) {
        let frozen = Object.freeze(object);
        this.countdown(frozen.start);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  setLimit() {
    let limit = parseInt(limitInput.value);
    return limit;
  }

  wordCount(event) {
    let count = 0,
      input = [],
      wordMatch;

    let characters = event.target.value;
    input.push(characters);

    input.forEach((word) => {
      if ((wordMatch = word.match(regex))) {
        count += wordMatch.length;
        wordCount.innerText = count;
      } else if (wordMatch === null) {
        wordCount.innerText = "0";
      }

      let words = Storage.addWordsToStorage(count);
    });
  }

  sentenceCount(event) {
    let characters = [],
      sentenceMatch;

    let text = event.target.value;
    characters.push(text);

    characters.forEach((sentence) => {
      let value = 0;
      if ((sentenceMatch = sentence.match(/\.+/g))) {
        value += sentenceMatch.length;
        sentenceCount.innerText = value;
      }
      let sentences = Storage.addSentenceToStorage(value);
    });
  }

  countSpace() {
    let spaces = 0,
      spaceMatch;
    let characters = getCharacters();
    characters.forEach((space) => {
      if ((spaceMatch = space.match(/\s+/g))) {
        spaces += spaceMatch.length;
      }
    });
    return spaces;
  }

  displayTotalCharacters() {
    let total = Storage.getCharactersFromStorage();
    total.forEach((count) => {
      totalCharacters.innerText = count;

      spaces.addEventListener("change", (event) => {
        let isChecked = event.target.checked;

        let excludeSpaces = count - this.countSpace();
        if (isChecked) {
          totalCharacters.innerText = excludeSpaces;
        } else {
          totalCharacters.innerText = count;
        }

        if (characterInput.value == "") totalCharacters.innerText = "00";
      });

      if (count >= this.setLimit(event)) {
        limitReached.classList.add("show");
        characterInput.classList.add("limit");
      } else if (count <= this.setLimit()) {
        limitReached.classList.remove("show");
        characterInput.classList.remove("limit");
      }
    });
  }

  displayWordCount() {
    let totalWords = Storage.getWordsFromStorage();
    totalWords.forEach((word) => {
      wordCount.innerText = word;
    });
  }

  displaySentenceCount() {
    let sentence = Storage.getSentenceFromStorage();
    sentence.forEach((value) => {
      sentenceCount.innerText = value;
    });
  }

  countdown(start = false) {
    let countdown = 60;

    if (start) {
      let timeout = setInterval(() => {
        readingTime.innerText = `${countdown--} seconds`;

        if (countdown <= 0) {
          clearInterval(timeout);
          readingTime.innerText = "0 seconds";

          let graph = buildGraph(getCharacters(), (character) => {
            if (character.match(regex)) return character;
          })
            .filter(({ alphabet }) => alphabet !== undefined)
            .sort((a, b) => (a.count < b.count ? 1 : -1));
          Storage.saveGraphToStorage(graph);
          Storage.addTextToStorage(getCharacters());
          countdown === 0 ? alphabetStats(graph) : undefined;
        }

        const resetUI = document.querySelector(".reset");
        resetUI.addEventListener("click", () => {
          this.resetUI();
          clearInterval(timeout);
        });
      }, second);
    }
  }

  addGraphToDOM() {
    let newGraph = Storage.getGraphFromStorage();
    return alphabetStats(newGraph);
  }

  addTextToCharacterInput() {
    let text = Storage.getTextFromStorage();
    for (let string of text) characterInput.value = string;
  }

  resetUI() {
    this.resetStats();
    this.resetGraph();
    this.resetUtilities();
    localStorage.clear();
    statsParagraph.style.display = "block";
  }

  resetUtilities() {
    limitInput.value = "";
    characterInput.value = "";
    limitReached.classList.add("hide");
    characterInput.classList.add("border");
    characterInput.classList.remove("limit");
  }

  resetStats() {
    wordCount.innerText = "00";
    totalCharacters.innerText = "00";
    sentenceCount.innerText = "00";
    readingTime.innerText = "1 minute";
    localStorage.removeItem("text");
    localStorage.removeItem("totalCharacters");
    localStorage.removeItem("wordCount");
    localStorage.removeItem("sentenceCount");
  }

  resetGraph() {
    button.remove();
    wrapper.innerHTML = "";
    wrapper.style.height = "0px";
    statsParagraph.classList.add("view");
    wrapper.classList.remove("height-limit");
  }

  render() {
    this.displayTotalCharacters();
    this.displayWordCount();
    this.displaySentenceCount();

    if (localStorage.getItem("graph") !== null) {
      this.addGraphToDOM();
      this.addTextToCharacterInput();
    }
  }
}

const stats = new CharacterStats();
stats.handleEvent();
