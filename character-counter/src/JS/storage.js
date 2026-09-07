"use strict";

class Storage {

static addTextToStorage(characters)  {
  localStorage.setItem("text", JSON.stringify(characters));
}

static getTextFromStorage()  {
  let text;

  if (localStorage.getItem("text") !== null)  {
    text = JSON.parse(localStorage.getItem("text"))
  } 

  return text;
}

static addCharactersToStorage(count) {
    let characters = this.getCharactersFromStorage();

    characters.push(count);
    localStorage.setItem("totalCharacters", JSON.stringify(characters));
    return characters;
  }

  static getCharactersFromStorage() {
    let characters;
    if (localStorage.getItem("totalCharacters") == null) {
      characters = [];
    } else {
      characters = JSON.parse(localStorage.getItem("totalCharacters"));
    }
    return characters;
  }

  static addWordsToStorage(count) {
    let words = this.getWordsFromStorage();

    words.push(count);
    localStorage.setItem("wordCount", JSON.stringify(words));
    return words;
  }

  static getWordsFromStorage() {
    let words;

    if (localStorage.getItem("wordCount") == null) {
      words = [];
    } else {
      words = JSON.parse(localStorage.getItem("wordCount"));
    }
    return words;
  }

  static addSentenceToStorage(value) {
    let sentence = this.getSentenceFromStorage();

    sentence.push(value);
    localStorage.setItem("sentenceCount", JSON.stringify(sentence));

    return sentence;
  }

  static getSentenceFromStorage() {
    let sentence;

    if (localStorage.getItem("sentenceCount") == null) {
      sentence = [];
    } else {
      sentence = JSON.parse(localStorage.getItem("sentenceCount"));
    }
    return sentence;
  }

  // graphStorage
  static getGraphFromStorage() {
    let graph;

    if (localStorage.getItem("graph") !== null) {
      graph = JSON.parse(localStorage.getItem("graph"))
    } 
    return graph;
  }

  static saveGraphToStorage(object) {
    localStorage.setItem("graph", JSON.stringify(object));
  }
}

export default Storage;