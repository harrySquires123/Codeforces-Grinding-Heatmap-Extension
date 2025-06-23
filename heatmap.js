// Ensure D3.js is available
if (typeof d3 === "undefined") {
    console.error("D3.js is not loaded. Heatmap cannot be rendered.");
}

// Extract username from the URL
const username = window.location.pathname.split("/").pop();
if (!username) {
    console.error("Could not detect Codeforces username.");
}

// Helper to get problem URL
function findProblemURL(contestId, index) {
    if (contestId && contestId.toString().length <= 4) {
        return `https://codeforces.com/problemset/problem/${contestId}/${index}`;
    } else {
        return `https://codeforces.com/problemset/gymProblem/${contestId}/${index}`;
    }
}

// Caching
let submissionCache = {};
let firstSubmissionYear = 2015;
const currentYear = new Date().getFullYear();

// Rating colors
const ratingColors = [
    { min: 9, color: 'rgba(170,0,0,1)' },
    { min: 8, color: 'rgb(255, 0, 0)' },
    { min: 7, color: 'rgba(255, 100, 100, 1)' },
    { min: 6, color: 'rgba(255,187,85,1)' },
    { min: 5, color: 'rgba(255,204,136,1)' },
    { min: 4, color: 'rgba(255, 85, 255, 1)' },
    { min: 3, color: 'rgba(170,170,255,1)' },
    { min: 2, color: 'rgba(119,221,187,1)' },
    { min: 1, color: 'rgba(119,255,119,1)' },
    { min: 0, color: 'rgba(204,204,204,1)' }
];

const handle = username;
const timestamp = Math.floor(Date.now() / 1000);
const method = "user.status";

// SHA512 hashing
async function sha512(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-512", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// Final API URL
async function generateUrl() {
    const hash = await sha512(stringToHash);
    const apiSig = rand + hash;
    return `https://codeforces.com/api/${method}?${queryString}&apiSig=${apiSig}`;
}
async function fetchSubmissionData() {
    if (Object.keys(submissionCache).length > 0) {
        return submissionCache;
    }

    try {
        const { cfApiKey, cfSecretKey } = await new Promise(resolve =>
            chrome.storage.local.get(["cfApiKey", "cfSecretKey"], resolve)
        );

        let finalUrl = "";
        if (cfApiKey && cfSecretKey) {
            const timestamp = Math.floor(Date.now() / 1000);
            const rand = [...Array(6)].map(() => Math.random().toString(36)[2]).join("");
            const method = "user.status";
            const params = {
                handle: handle,
                count: "10000",
                apiKey: cfApiKey,
                time: timestamp.toString()
            };
            const sortedKeys = Object.keys(params).sort();
            const queryString = sortedKeys.map(key =>
                `${key}=${encodeURIComponent(params[key])}`
            ).join("&");
            const stringToHash = `${rand}/${method}?${queryString}#${cfSecretKey}`;

            const hash = await sha512(stringToHash);
            const apiSig = rand + hash;
            finalUrl = `https://codeforces.com/api/${method}?${queryString}&apiSig=${apiSig}`;
        } else {
            finalUrl = `https://codeforces.com/api/user.status?handle=${handle}&status=OK`;
        }

        const response = await fetch(finalUrl);
        const data = await response.json();

        if (!response.ok || data.status !== "OK") throw new Error("API error");

        let firstSubmissionTime = data.result[data.result.length - 1].creationTimeSeconds;
        firstSubmissionYear = new Date(firstSubmissionTime * 1000).getFullYear();
        let visited = new Set();

        for (let i = data.result.length - 1; i >= 0; i--) {
            const sub = data.result[i];
            let date = new Date(sub.creationTimeSeconds * 1000);
            let year = date.getFullYear();
            let formattedDate = date.toLocaleDateString("en-CA");
            let problemRating = sub.problem.rating || 0;
            let problemName = sub.problem.name;
            let problemLink = findProblemURL(sub.contestId, sub.problem.index);
            let problemId = `${sub.contestId}-${sub.problem.index}`;

            if (sub.verdict === "OK") {
                if (!submissionCache[year]) submissionCache[year] = {};
                if (!submissionCache[year][formattedDate]) {
                    submissionCache[year][formattedDate] = { problems: [] };
                }
                if (!submissionCache[year][formattedDate].problems.some(p => p.id === problemId)) {
                    let isDuplicate = visited.has(problemId);
                    visited.add(problemId);
                    submissionCache[year][formattedDate].problems.push({
                        rating: problemRating,
                        name: problemName,
                        link: problemLink,
                        id: problemId,
                        isDuplicate: isDuplicate
                    });
                }
            }
        }

        submissionCache[0] = {
            ...submissionCache[currentYear] || {},
            ...submissionCache[currentYear - 1] || {}
        };

        return submissionCache;
    } catch (error) {
        console.error("Error fetching data:", error);
        return {};
    }
}


// Tooltip
let tooltip = d3.select("body").append("div")
    .attr("id", "heatmap-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "white")
    .style("padding", "8px")
    .style("border-radius", "5px")
    .style("font-size", "12px")
    .style("max-width", "250px")
    .style("z-index", "1000")
    .style("pointer-events", "auto")
    .on("mouseover", function () {
        tooltip.style("visibility", "visible");
    })
    .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
    });

let container = d3.select("#pageContent").append("div")
    .attr("id", "cf-grinding-heatmap-container")
    .classed("roundbox borderTopRound borderBottomRound", true)
    .style("margin-top", "1em")
    .style("padding", "10px")
    .style("background", "white")
    .style("display", "flex")
    .style("flex-direction", "column");

container.append("h3")
    .text("Grinding Heatmap")
    .style("margin", "10px 0 20px 5px")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .style("color", "#333");

let heatmap = d3.select("#cf-grinding-heatmap-container").append("div")
    .attr("id", "cf-grinding-heatmap");

heatmap.append("div")
    .attr("id", "loading-message")
    .style("text-align", "left")
    .style("font-size", "16px")
    .style("padding", "5px")
    .text("Loading...");

// Helper: generate heatmap
function createHeatmap(year) {
    let width = 850, height = 180, cellSize = 15;
    let startDate, endDate;
    if (year === 0) {
        let today = new Date();
        endDate = new Date(today);
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 365);
        startDate.setDate(startDate.getDate() + 7 - ((startDate.getDay() + 1) % 7));
    } else {
        startDate = new Date(year, 0, 1);
        endDate = new Date(year + 1, 0, 1);
    }

    let dates = d3.timeDays(startDate, endDate);
    let parseDate = d3.timeFormat("%Y-%m-%d");

    d3.select("#cf-grinding-heatmap").remove();

    let heatmap = d3.select("#cf-grinding-heatmap-container").append("div")
        .attr("id", "cf-grinding-heatmap");

    let titleContainer = heatmap.append("div")
        .style("display", "flex")
        .style("justify-content", "space-between")
        .style("align-items", "center")
        .style("width", "100%");

    titleContainer.append("div")
        .style("position", "absolute")
        .style("left", "50%")
        .style("transform", "translate(-50%, -50%)")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .style("color", "#333")
        .text(`grinding heatmap for ${username}`);

    let yearSelectContainer = titleContainer.append("div")
        .style("display", "flex")
        .style("justify-content", "flex-end")
        .style("width", "100%");

    let yearSelect = yearSelectContainer.append("select")
        .style("margin-bottom", "10px")
        .style("padding", "5px")
        .style("font-size", "14px")
        .on("change", function () { renderHeatmap(parseInt(this.value)); });

    yearSelect.append("option").attr("value", 0).text("Choose year");
    for (let y = currentYear; y >= firstSubmissionYear; y--) {
        yearSelect.append("option").attr("value", y).text(y);
    }
    yearSelect.property("value", year);

    let svg = heatmap.append("svg")
        .attr("viewBox", `0 0 ${width} ${height + 20}`)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .style("width", "100%")
        .style("height", "auto");

    svg.selectAll("rect")
        .data(dates)
        .enter().append("rect")
        .attr("x", d => d3.timeWeek.count(startDate, d) * cellSize + 35)
        .attr("y", d => d.getDay() * cellSize + 20)
        .attr("width", cellSize - 2)
        .attr("height", cellSize - 2)
        .attr("fill", "#ebedf0")
        .on("mouseover", function (event, d) {
            let dateKey = parseDate(d);
            let solved = submissionCache[year]?.[dateKey]?.problems || [];
            if (solved.length > 0) {
                let html = `<strong>${dateKey}</strong><br>`;
                solved.forEach(p => {
                    const color = p.isDuplicate ? '#A9A9A9' : 'lightblue';
                    html += `<a href="${p.link}" target="_blank" style="color: ${color};">${p.name} (${p.rating})</a><br>`;
                });
                tooltip.html(html)
                    .style("left", (event.pageX + 4) + "px")
                    .style("top", (event.pageY + 4) + "px")
                    .style("visibility", "visible");
            }
        });

    svg.on("mouseleave", function () {
        tooltip.style("visibility", "hidden");
    });

    svg.selectAll(".month-label")
        .data(d3.timeMonths(startDate, endDate))
        .enter().append("text")
        .attr("x", d => (d3.timeWeek.count(startDate, d) * cellSize) + 45)
        .attr("y", 12)
        .style("font-size", "12px")
        .text(d3.timeFormat("%b"));

    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    svg.selectAll(".day-label")
        .data([1, 3, 5])
        .enter()
        .append("text")
        .attr("x", 30)
        .attr("y", d => d * cellSize + 30)
        .attr("text-anchor", "end")
        .style("font-size", "12px")
        .text(d => days[d]);

    return { svg, dates, parseDate };
}

// Get color by count
function getRatingColor(problems) {
    if (!problems.length) return "#ebedf0";
    let colorEntry = ratingColors.find(c => problems.length >= c.min);
    return colorEntry ? colorEntry.color : "#ebedf0";
}

// Draw heatmap
async function renderHeatmap(year) {
    let { svg, dates, parseDate } = createHeatmap(year);
    let submissionData = await fetchSubmissionData();
    let solvedDates = submissionData[year] || {};

    svg.selectAll("rect")
        .transition().duration(200)
        .attr("fill", d => {
            let dateKey = parseDate(d);
            return solvedDates[dateKey] ? getRatingColor(solvedDates[dateKey].problems) : "#ebedf0";
        });
}

// Initial render
fetchSubmissionData().then(() => {
    renderHeatmap(0);
});
