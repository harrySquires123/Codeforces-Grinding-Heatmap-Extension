const apiKeyInput = document.getElementById("apiKey");
const secretKeyInput = document.getElementById("secretKey");

// Load saved values
apiKeyInput.value = localStorage.getItem("cf_apiKey") || "";
secretKeyInput.value = localStorage.getItem("cf_secretKey") || "";

// Auto-save on input
apiKeyInput.addEventListener("input", () => {
  localStorage.setItem("cf_apiKey", apiKeyInput.value);
});

secretKeyInput.addEventListener("input", () => {
  localStorage.setItem("cf_secretKey", secretKeyInput.value);
});
