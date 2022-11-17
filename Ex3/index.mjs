import { multiply, divide, sum, substract } from "./calculator.mjs"

import * as readline from "readline"

function askQuestion(query) {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
      rl.close();
      resolve(ans);
  }))
}

async function main() {
  const response = await askQuestion("Qu'est-ce qu'il te ferrai plaisir ?")

  const split = response.split(/([+,-,*,\/,x/])/g)

  let num1 = parseInt(split[0], 10)
  let num2 = parseInt(split[2], 10)

  switch (split[1]) {
    case "+":
      console.log('Résultat : ', sum(num1, num2))
      break;
    case "-":
      console.log('Résultat : ', substract(num1, num2))
      break;
    case "*":
      console.log('Résultat : ', multiply(num1, num2))
      break;
    case "x":
      console.log('Résultat : ', multiply(num1, num2))
      break;
    case "/":
      console.log('Résultat : ', divide(num1, num2))
      break;
  }
}

main()