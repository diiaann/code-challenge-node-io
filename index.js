const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express()

const directoryPath = path.join(__dirname, 'pages');
const buildPath = path.join(__dirname, 'html');
const port = 3000;
const WORD_END_PUNCTUATION = [',', '?', ':', ';', '!', '.', ' '] // does not cover exhaustively the english language
let pages = [];

if (!fs.existsSync(buildPath)){
  fs.mkdirSync(buildPath)
}

fs.readdirSync(directoryPath).forEach(file => {
  pages.push(path.parse(file).name);
});


pages.forEach(file => {
  fs.readFile(directoryPath + '/' + file +'.txt', 'utf8', (err, data) => {
    const title = `<h1>${file}</h1>`
    fs.writeFile(buildPath + '/' + file + '.html', title + convertTextToString(data, pages), (err, result) => {
      if (err) console.log('error', err)
    })
  })
})

app.get('/', (req, res) => {
  res.render('index.pug', {pages})
})

app.use(express.static(__dirname + '/html'));
app.listen(port, () => console.log(`app listening on port ${port}`))


function convertTextToString(text, list) {
  let newText = '';
  let currentWord = '';
  const createLink = (word) => `<a href="/${word}.html">${word}</a>`
  const isWordEnd = (letter) => WORD_END_PUNCTUATION.indexOf(letter) !== -1

  for (var i = 0; i < text.length; i++) {

    if (!isWordEnd(text[i])) { // is part of word
      currentWord = currentWord + text[i];
    } else {
      if (list.indexOf(currentWord) !== -1) { // matches a word on our list
        newText = newText + createLink(currentWord) + text[i];
      }
      else {
        newText = newText + currentWord + text[i];
      }
      currentWord = ''
    }
  }
  return newText;
}
