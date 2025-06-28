document.getElementById("apiKey").addEventListener("input", e => {
    chrome.storage.local.set({ cf_apiKey: e.target.value });
});

document.getElementById("secretKey").addEventListener("input", e => {
    chrome.storage.local.set({ cf_secretKey: e.target.value });
});
  
// To load saved values
chrome.storage.local.get(["cf_apiKey", "cf_secretKey"], (result) => {
    document.getElementById("apiKey").value = result.cf_apiKey || "";
    document.getElementById("secretKey").value = result.cf_secretKey || "";
});
