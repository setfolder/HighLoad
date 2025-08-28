// Script for creating a load on the browser.
// Doesn't consume many computer resources, but loads the browser with work for at least several minutes.
let total = 0;
for (let i = 0; i < 1e10; i++) {
  total += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
};
console.log("Ready:", total);