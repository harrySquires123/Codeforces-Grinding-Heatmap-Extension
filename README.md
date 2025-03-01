# Codeforces Rating-Based Heatmap

## Overview

This project provides a **rating-based heatmap** visualization for Codeforces users, enhancing the traditional heatmap by incorporating problem difficulty levels. Unlike the default Codeforces heatmap, which only considers the number of problems solved, this heatmap assigns colors based on the **highest-rated problem** solved on each day.

## Features

### 1. **Rating-Based Color Mapping**

- The heatmap color on a given day represents the maximum rating of a problem solved that day.
- This prevents inflation by solving only easy problems and provides a true measure of problem-solving difficulty.

#### **Color Mapping by Rating:**

| Rating Range | Color                                |
| ------------ | ------------------------------------ |
| 3000+        | Dark Red (rgba(170,0,0,0.9))         |
| 2600 - 2999  | Bright Red (rgb(255, 0, 0))          |
| 2400 - 2599  | Light Red (rgba(255, 100, 100, 0.9)) |
| 2300 - 2399  | Orange (rgba(255,187,85,0.9))        |
| 2100 - 2299  | Light Orange (rgba(255,204,136,0.9)) |
| 1900 - 2099  | Pink (rgba(255, 85, 255, 0.9))       |
| 1600 - 1899  | Light Blue (rgba(170,170,255,0.9))   |
| 1400 - 1599  | Aqua Green (rgba(119,221,187,0.9))   |
| 1200 - 1399  | Green (rgba(119,255,119,0.9))        |
| 0 - 1199     | Gray (rgba(204,204,204,0.9))         |

### 2. **Problem Hover Details**

- Hovering over any day in the heatmap displays a tooltip listing **all problems** solved on that day.
- The tooltip contains:
  - Problem Name
  - Problem Rating
  - Direct Link to the Problem

## How It Helps

- Provides an **honest measure** of problem difficulty solved over time.
- Helps track and analyze **problem-solving trends** based on difficulty.
- Allows users to **review past problem-solving history** easily by hovering over days.
- Ideal for self-assessment and tracking competitive programming improvement.

## Usage

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Open the project in a browser or deploy it.
3. Enter the **Codeforces handle** to generate the heatmap.
4. Hover over the heatmap to see past problems solved.

## Contribution

Feel free to contribute by improving UI, adding features, or optimizing data retrieval. Fork the repo and submit a pull request!

## License

This project is licensed under the MIT License.

