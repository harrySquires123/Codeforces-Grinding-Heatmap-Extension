// Wait for the page to fully load
window.addEventListener("load", function () {
    let observer = new MutationObserver((mutations, obs) => {
        let activityBox = document.querySelector("#pageContent");
        if (activityBox) {
            obs.disconnect();

            // Create a dedicated container for the heatmap
            let heatmapContainer = document.createElement("div");
            heatmapContainer.id = "cf-heatmap-container";
            heatmapContainer.classList.add("roundbox"); // Codeforces' default class

            heatmapContainer.style.visibility = "hidden"; // Hide until fully loaded
            // Insert the container after the activity box
            activityBox.parentNode.appendChild(heatmapContainer);

            // Inject D3.js
            let d3Script = document.createElement("script");
            d3Script.src = chrome.runtime.getURL("libs/d3.min.js");
            d3Script.onload = () => {
                console.log("D3.js loaded");

                // Inject heatmap.js
                let script = document.createElement("script");
                script.src = chrome.runtime.getURL("heatmap.js");
                script.type = "module";
                document.body.appendChild(script);
            };
            document.body.appendChild(d3Script);
        }
    });

    observer.observe(document, { childList: true, subtree: true });
});
