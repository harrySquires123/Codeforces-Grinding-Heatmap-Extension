// Wait for the page to fully load
document.addEventListener("DOMContentLoaded", function () {
    let observer = new MutationObserver((mutations, obs) => {
        let activityBox = document.querySelector("#pageContent");
        if (activityBox) {
            obs.disconnect();

            // Container for the heatmap
            let heatmapContainer = document.createElement("div");
            heatmapContainer.id = "cf-heatmap-container";
            heatmapContainer.classList.add("roundbox"); // Codeforces' default class

            heatmapContainer.style.visibility = "hidden"; // Hide until fully loaded

            // Create a title element TODO: add title
            let title = document.createElement("h2");
            title.textContent = "Rating Heatmap";
            title.style.textAlign = "center";
            title.style.marginBottom = "10px";

            // Append the title to the container
            heatmapContainer.appendChild(title);

            console.log(document.querySelector("#cf-heatmap-container h2"));

            // Insert the container after the activity box
            activityBox.parentNode.appendChild(heatmapContainer);
        }
    });

    observer.observe(document, { childList: true, subtree: true });
});
