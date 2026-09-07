"use strict";
let output;

const characterInput = document.querySelector("#character-input");
const wrapper = document.querySelector(".progress-wrapper");
const contents = document.querySelector(".contents");
const limitReached = document.querySelector(".limit-reached");
const statsParagraph = document.querySelector(".stats-paragraph");

function buildGraph(characters, group) {
  let graph = new Array();
  for (let item of characters) {
    for (let C = 0; C < item.length; C++) {
      let alphabet = group(item[C]);
      let known = graph.find((c) => c.alphabet == alphabet);
      if (!known) {
        graph.push({ alphabet, count: 1 });
      } else {
        known.count++;
      }
    }
  }
  return graph;
}

export function getCharacters() {
  let characters = [];
  characters.push(characterInput.value);
  return characters;
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  button.innerText = "See More";
  const icon = createIcon("fa-solid fa-chevron-down");
  button.append(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

let button = createButton("see more-less");
const icon = createIcon("fa-solid fa-chevron-down");

export function alphabetStats(object) {
  object.forEach((brace) => {
    let progressBars = document.createElement("div");
    progressBars.className = "progress-bars";

    let div = document.createElement("div");
    let letter = document.createElement("p");
    letter.className = "alphabet";
    letter.innerText = brace.alphabet.toUpperCase();
    div.append(letter);

    // (2)
    let progress = document.createElement("div");
    progress.className = "progress";

    let bar = document.createElement("div");
    bar.className = "bar";

    setTimeout(() => {
      bar.classList.add("smooth");
      let count = Math.min(brace.count, 100);
      bar.style.width = `${count}%`;
    }, 500);

    progress.appendChild(bar);

    // (3)
    let totalCount = object.reduce((combine, { count }) => {
      return combine + count;
    }, 0);

    let percentage = (brace.count / totalCount) * 100;

    let letterStats = document.createElement("div");
    letterStats.className = "letter-stats";

    let stats = 0;
    let timerID = setInterval(() => {
      letterStats.innerText = `${stats++}(${percentage.toPrecision(3)}) `;

      if (stats == brace.count) {
        clearInterval(timerID);
      }
    }, 100);

    progressBars.append(div, progress, letterStats);

    const displayGraph = () => {
      let appended = wrapper.appendChild(progressBars) ? true : false;
      if (appended) {
        wrapper.style.height = "200px";
        statsParagraph.style.display = "none";
        contents.append(button);
      } else if (!appended) {
        wrapper.classList.remove("height-limit");
        statsParagraph.classList.remove("hide");
      }
    };
    displayGraph();
  });
}

function toggleGraph() {
  if (parseInt(wrapper.style.height) !== wrapper.scrollHeight) {
    wrapper.style.height = wrapper.scrollHeight + "px";
    button.textContent = "See Less";
    icon.classList.replace("fa-chevron-down", "fa-chevron-up");
    button.append(icon);
  } else if (wrapper.innerHTML !== "") {
    wrapper.style.height = "200px";
    button.textContent = "See More";
    icon.classList.replace("fa-chevron-up", "fa-chevron-down");
    button.append(icon);
  }
}

button.addEventListener("click", toggleGraph);

document.addEventListener("DOMContentLoaded", () => {
  if (characterInput.value == "") {
    limitReached.remove();
  }

  if (wrapper.innerHTML == "") {
    button.remove();
  }
});

export { buildGraph, contents, button };
