# Codeforces Rating-Based Heatmap

## Overview

This project visualizes a Codeforces user's problem-solving activity in a **heatmap format**. Unlike the standard Codeforces heatmap, which only considers the number of problems solved per day, this heatmap is **based on the highest-rated problem solved each day**.

## 🔹 Key Features

- **Rating-based heatmap**:- The heatmap color on a given day represents the maximum rating of a problem solved that day.
- **Hover for details**: Hovering over any day in the heatmap displays a tooltip listing **all problems** solved on that day.
- The tooltip contains:
  - Problem Name
  - Problem Rating
  - Direct Link to the Problem
- **Multi-year support**: Analyze past performance over different years.

## 🎨 Color Mapping

The heatmap colors are based on the highest-rated problem solved on a given day. Here’s the rating-to-color mapping:

| Rating Range | Color                                                        |
| ------------ | ------------------------------------------------------------ |
| 3000+        | Dark Red                                                     |
| 2600-2999    | Bright Red                                                   |
| 2400-2599    | Light Red                                                    |
| 2300-2399    | Orange                                                       |
| 2100-2299    | Light Orange                                                 |
| 1900-2099    | Pink                                                         |
| 1600-1899    | Light Blue                                                   |
| 1400-1599    | Aqua Green (`#77DDBB` equivalent to `rgba(119,221,187,0.9)`) |
| 1200-1399    | Green                                                        |
| 0-1199       | Gray                                                         |

## How It Helps

- Provides an **honest measure** of problem difficulty solved over time.
- Helps track and analyze **problem-solving trends** based on difficulty.
- Allows users to **review past problem-solving history** easily by hovering over days.
- Prevents inflation by solving only easy problems and provides a true measure of problem-solving difficulty.
- Ideal for self-assessment and tracking competitive programming improvement.

## 🚀 Installation & Usage

### Chrome Extension Setup

1. Download the ZIP file from the repository.
2. Extract the ZIP.
3. Open **Chrome** and go to `chrome://extensions/`.
4. Enable **Developer Mode** (toggle in the top right corner).
5. Click **Load unpacked** and select the extracted folder.

## 📸 Screenshots

### Heatmap

### Hover Feature

## 📌 Future Improvements

- Add support for more competitive programming platforms (AtCoder, LeetCode, etc.)
- Implement filters for problem tags and difficulty levels
- Add dark mode

## 🙌 Contributions

Feel free to contribute by improving UI, adding features. Fork the repo and submit a pull request!

## 📜 License

This project is licensed under the MIT License.


