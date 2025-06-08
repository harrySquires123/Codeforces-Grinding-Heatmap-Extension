# Codeforces Rating-Based Heatmap

## Overview

This project visualizes a Codeforces user's problem-solving activity in a **heatmap format**. Unlike the standard Codeforces heatmap, which only considers the number of problems solved per day, this heatmap is **based on the highest-rated problem solved each day**.
[Download from Chrome Web Store](https://chromewebstore.google.com/detail/codeforces-rating-based-h/heajdhmohlobjebkgkpdomkaihaghkgb)

## Key Features

- **🎨 Rating-Based Colors**  
  The heatmap color on a given day represents the **maximum rating** of a problem solved that day.

- **🖱️ Hover for Details**  
  - Hovering over any day in the heatmap shows a **tooltip** with all problems solved on that day.  
  - The tooltip includes:
    - 📌 **Problem Name**  
    - ⭐ **Problem Rating**  
    - 🔗 **Direct Link to the Problem**  

- **📅 Multi-Year Support**  
  - Analyze past performance across **multiple years** with ease.

## 🎨 Color Mapping

The heatmap colors are based on the highest-rated problem solved on a given day. Here’s the rating-to-color mapping:

| Problem Rating Range | Color |
| ------------ | ---------------------------------------------- |
| 3000+        | ![#AA0000](https://placehold.co/15x15/AA0000/AA0000.png) `Dark Red` |
| 2600-2999    | ![#FF0000](https://placehold.co/15x15/FF0000/FF0000.png) `Bright Red` |
| 2400-2599    | ![#FF6464](https://placehold.co/15x15/FF6464/FF6464.png) `Light Red` |
| 2300-2399    | ![#FFBB55](https://placehold.co/15x15/FFBB55/FFBB55.png) `Orange` |
| 2100-2299    | ![#FFCC88](https://placehold.co/15x15/FFCC88/FFCC88.png) `Light Orange` |
| 1900-2099    | ![#FF55FF](https://placehold.co/15x15/FF55FF/FF55FF.png) `Purple` |
| 1600-1899    | ![#AAAAFF](https://placehold.co/15x15/AAAAFF/AAAAFF.png) `Light Blue` |
| 1400-1599    | ![#77DDBB](https://placehold.co/15x15/77DDBB/77DDBB.png) `Aqua Green` |
| 1200-1399    | ![#77FF77](https://placehold.co/15x15/77FF77/77FF77.png) `Green` |
| 0-1199       | ![#CCCCCC](https://placehold.co/15x15/CCCCCC/CCCCCC.png) `Gray` |

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
![image](https://github.com/user-attachments/assets/6606ce43-dd9e-45bb-8a43-26b25bec6e5f)

### Hover Feature
![image](https://github.com/user-attachments/assets/ba2c802e-870a-4ec8-af33-34cfc9a37459)

## 📌 Future Improvements

- Show different intensity based on weighted average of problem rating solved in a day.
- Add dark mode

## 🙌 Contributions

Feel free to contribute by improving UI, adding features. Fork the repo and submit a pull request!

## 📜 License

This project is licensed under the MIT License.


