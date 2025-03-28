// Ensure D3.js is available
if (typeof d3 === "undefined") {
    console.error("D3.js is not loaded. Heatmap cannot be rendered.");
}

// Extract username from the URL
const username = window.location.pathname.split("/").pop();
if (!username) {
    console.error("Could not detect Codeforces username.");
}

function findProblemURL(contestId,index){
    if(contestId && contestId.toString().length<=4){
      return `https://codeforces.com/problemset/problem/${contestId}/${index}`;
    }else{
      return `https://codeforces.com/problemset/gymProblem/${contestId}/${index}`;
    }
}

// Cache API response
let submissionCache = {};
let firstSubmissionYear = 2015; // Default value
const currentYear = new Date().getFullYear();

// CF Rating Color Mapping
const ratingColors = [
    { min: 3000, color: 'rgba(170,0,0,0.9)', len: 6, idx: 0},
    { min: 2600, color: 'rgb(255, 0, 0)', len: 4, idx: 1}, //rgba(200, 0, 0, 0.9)
    { min: 2400, color: 'rgba(255, 100, 100, 0.9)', len: 2, idx: 2},
    { min: 2300, color: 'rgba(255,187,85,0.9)', len: 1, idx: 3},
    { min: 2100, color: 'rgba(255,204,136,0.9)', len: 2, idx: 4},
    { min: 1900, color: 'rgba(255, 85, 255, 0.9)', len: 2, idx: 5}, //rgba(255,136,255,0.9)
    { min: 1600, color: 'rgba(170,170,255,0.9)', len: 3, idx: 6},// rgba(120, 120, 255, 0.9)
    { min: 1400, color: 'rgba(119,221,187,0.9)', len: 2, idx: 7},
    { min: 1200, color: 'rgba(119,255,119,0.9)', len: 2, idx: 8},
    { min: 0, color: 'rgba(204,204,204,0.9)', len: 12, idx: 9}
];

async function fetchSubmissionData() {
    if (Object.keys(submissionCache).length > 0) {
        return submissionCache;
    }
    try {
        let response = await fetch(`https://codeforces.com/api/user.status?handle=${username}&status=OK`);
        let data = await response.json();
        if (!response.ok || data.status !== "OK") throw new Error("API error");

         // Extract first submission year
        let firstSubmissionTime = data.result[data.result.length - 1].creationTimeSeconds;
        firstSubmissionYear = new Date(firstSubmissionTime * 1000).getFullYear();
        let visited = new Set();
        
        for (let i = data.result.length - 1; i >= 0; i--) { // iterate from oldest to newest submission
            const sub = data.result[i];
            let date = new Date(sub.creationTimeSeconds * 1000); // creationTimeSeconds - UTC date
            let year = date.getFullYear(); // local year
            let formattedDate = date.toLocaleDateString("en-CA"); // local date
            let problemRating = sub.problem.rating || 0;
            let problemName = sub.problem.name;
            let problemLink = findProblemURL(sub.contestId,sub.problem.index);
            let problemId = `${sub.contestId}-${sub.problem.index}`; // Unique identifier

            if (sub.verdict === "OK") {
                if (!submissionCache[year]) submissionCache[year] = {};
                if (!submissionCache[year][formattedDate]) {
                    submissionCache[year][formattedDate] = { problems: [] };
                }
                // Brute force duplicate check per day. This is fine since the number of problems solved per day is small
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

// Create tooltip
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
    .style("pointer-events", "auto") // Allow tooltip to be hovered over
    .on("mouseover", function () { 
        tooltip.style("visibility", "visible"); 
    })
    .on("mouseout", function () { 
        tooltip.style("visibility", "hidden"); 
    });


let container = d3.select("#pageContent").append("div")
    .attr("id", "cf-heatmap-container")
    .classed("roundbox borderTopRound borderBottomRound", true) // codeforces classes
    .style("margin-top", "1em")    
    .style("padding", "10px")
    .style("background", "white")
    .style("display", "flex")
    .style("flex-direction", "column");
    
// Add title at the top of the container
container.append("h3")
    .text("Rating-Based Heatmap")
    .style("margin", "10px 0 20px 5px") // Adds spacing below the title
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .style("color", "#333");

let heatmap = d3.select("#cf-heatmap-container").append("div")
    .attr("id", "cf-heatmap")
    
// Append a loading message inside the container
heatmap.append("div")
    .attr("id", "loading-message")
    .style("text-align", "left")
    .style("font-size", "16px")
    .style("padding", "5px")
    .text("Loading...");


function createHeatmap(year) {
    console.log(`Initializing heatmap for ${year}`);

    let width = 850, height = 180, cellSize = 15;
    let startDate, endDate;
    if (year === 0) { // Choose year
        let today = new Date();
        endDate = new Date(today);
        endDate.setDate(endDate.getDate()); // Ensure it includes the last day
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 365); // Subtracting 365 days    
        // Adjust to the nearest next Sunday like Codeforces
        startDate.setDate(startDate.getDate() + 7 - ((startDate.getDay()+1) % 7));    
    } else {
        startDate = new Date(year, 0, 1);
        endDate = new Date(year + 1, 0, 1);
    }

    let dates = d3.timeDays(startDate, endDate);
    let parseDate = d3.timeFormat("%Y-%m-%d");

    d3.select("#cf-heatmap").remove()

    let heatmap = d3.select("#cf-heatmap-container").append("div")
        .attr("id", "cf-heatmap")

    let titleContainer = heatmap.append("div")
        .style("display", "flex")
        .style("justify-content", "space-between")
        .style("align-items", "center")
        .style("width", "100%");

    // Add the title
    titleContainer.append("div")
        .style("position", "absolute")
        .style("left", "50%")
        .style("transform", "translate(-50%, -50%)")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .style("color", "#333")
        .text(`problem-solving heatmap for ${username}`);

    let yearSelectContainer = titleContainer.append("div")
        .style("display", "flex")
        .style("justify-content", "flex-end")
        .style("width", "100%");

    let yearSelect = yearSelectContainer.append("select")
        .style("margin-bottom", "10px")
        .style("padding", "5px")
        .style("font-size", "14px")
        .on("change", function () { renderHeatmap(parseInt(this.value)); });
    
    yearSelect.append("option").attr("value", 0).text("Choose year"); // Default option
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
            let solvedProblems = submissionCache[year]?.[dateKey]?.problems || [];
            if (solvedProblems.length > 0) {
                let tooltipHTML = `<strong>${dateKey}</strong><br>`;
                solvedProblems.forEach(prob => {
                    const isDuplicate = prob.isDuplicate;
                    const color = isDuplicate ? '#A9A9A9' : 'lightblue';
                    tooltipHTML += `<a href="${prob.link}" target="_blank" style="color: ${color};">${prob.name} (${prob.rating})</a><br>`;
                });

                tooltip.html(tooltipHTML)
                    .style("left", (event.pageX + 4) + "px")
                    .style("top", (event.pageY + 4) + "px")
                    .style("visibility", "visible");
            }
        })
        
        svg.on("mouseleave", function () {
            tooltip.style("visibility", "hidden");
        });

        // Month labels
        let months = d3.timeMonths(startDate, endDate);
        svg.selectAll(".month-label")
            .data(months)
            .enter().append("text")
            .attr("x", d => (d3.timeWeek.count(startDate, d) * cellSize) + 45)
            .attr("y", 12)
            .style("font-size", "12px")
            .text(d3.timeFormat("%b"));


        let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let filteredDays = [1, 3, 5];
        svg.selectAll(".day-label")
            .data(filteredDays)
            .enter()
            .append("text")
            .attr("x", 30)  // Adjust alignment
            .attr("y", d => d * cellSize + 30)  // Ensure correct positioning
            .attr("text-anchor", "end")
            .style("font-size", "12px")
            .text(d => days[d]);
        
    return { svg, dates, parseDate };
}

function getRatingColor(problems) {
    if (!problems.length) return "#ebedf0";

    let maxRating = Math.max(0, ...problems.filter(p => !p.isDuplicate).map(p => p.rating));

    // Find the color range of maxRating
    let colorEntry = ratingColors.find(c => maxRating >= c.min);
    let baseColor = colorEntry.color;

    let opacityFactor = 0.9;
    return baseColor.replace(/0\.9\)/, `${opacityFactor})`);
}

async function renderHeatmap(year) {
    let { svg, dates, parseDate } = createHeatmap(year);
    let submissionData = await fetchSubmissionData();
    let solvedDates = submissionData[year] || {};

    svg.selectAll("rect")
        .transition().duration(200) // Updated duration
        .attr("fill", d => {
            let dateKey = parseDate(d);
            return solvedDates[dateKey] ? getRatingColor(solvedDates[dateKey].problems) : "#ebedf0";
        });
}

fetchSubmissionData().then(() => {
    renderHeatmap(0);
});
