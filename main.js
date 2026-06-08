const button = document.getElementById("test-btn");
const status = document.getElementById("status");

let count = 0;

button.addEventListener("click", () => {
  count += 1;
  status.textContent = `クリック ${count} 回`;
});
