// Wait for the page to fully load
document.addEventListener("DOMContentLoaded", function() {
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
        }
    });

    observer.observe(document, { childList: true, subtree: true });
});
