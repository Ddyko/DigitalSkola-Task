import { kalkulator } from "./rumus.js";
import readline from "readline";

// Membuat interface untuk input dari terminal
const inputUser = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
inputUser.question("Masukkan angka pertama: ", (angka1) => {
  // tambahkan input untuk angka kedua
    inputUser.question("Masukkan angka kedua: ", (angka2) => {

        // tambahkan input untuk memasukkan operator(+, -, *, /)
         inputUser.question("Masukkan operator: ", (operator) => {

  console.log(
    `Hasil: ${kalkulator(parseFloat(angka1), parseFloat(angka2), operator)}`,
  );
  inputUser.close();
})})});

//Works well but need input on how to make the code look better (looks weird to have .question inside a .question)(dont undestand what .question does even in the documentation)
