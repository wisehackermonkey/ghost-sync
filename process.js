let TurndownService = require('turndown')

let turndownService = new TurndownService()
let markdown = turndownService.turndown(example1)
console.log(markdown)


const convert_html_to_markdown = (text) => turndownService.turndown(text)
const print = (text) => { console.log(text); return text; }

// https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
// https://www.freecodecamp.org/news/pipe-and-compose-in-javascript-5b04004ac937/
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

pipe(convert_html_to_markdown)(example1)


