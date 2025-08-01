# 🎡 Kirmes Website - Simple Deployment Guide

## ✅ Website Status: WORKING!

The website works perfectly in all modern web browsers (Firefox, Chrome, Edge, Safari).

## 🌐 How to Test

### **Firefox Testing:**
1. **Open Firefox**
2. **Press Ctrl+L** (address bar)
3. **Copy this path:**
   ```
   file:///d:/Qsync/05_Desktop/Kirmes_Urlaubsplanung/Kirmes-Website-Static/index.html
   ```
4. **Press Enter**
5. **Enter password:** `kirmes2025`

### **File Explorer Method:**
1. Navigate to: `d:\Qsync\05_Desktop\Kirmes_Urlaubsplanung\Kirmes-Website-Static\`
2. **Right-click `index.html`**
3. **Choose "Open with" → Firefox**

## 📁 Ready for Upload

**Files to upload to your web hosting:**
- `index.html` - Complete website
- `real-data.csv` - Your task data (IMPORTANT: file must be named exactly "real-data.csv")

**Upload process:**
1. Upload both files to your web root directory
2. Make sure the CSV file is named exactly `real-data.csv` (case-sensitive)
3. Open your website URL in any browser
4. Password: `kirmes2025`

## 🎯 Features

✅ **Modern Clean Design** - No distracting animations
✅ **Sticky Filter Header** - Always visible while scrolling
✅ **Advanced Filters** - Name search, day selection, task type
✅ **Single Scrollbar** - Clean layout with proper scrolling
✅ **Better Contrast** - Improved readability
✅ **Real Data Loading** - Works with your CSV file

## 🚀 Ready for Production!  
✅ **Password Protection** - `kirmes2025`  
✅ **Search by Name** - Find assignments quickly  
✅ **Works Everywhere** - Any web hosting, any browser  
✅ **Mobile Friendly** - Works on phones and tablets  
✅ **CSV Support** - Just maintain the required file name `real-data.csv`

## 📝 Quick Notes

- Works on any web hosting (even free hosting)
- No server setup needed - pure HTML/CSS/JavaScript
- Update CSV file anytime by replacing `real-data.csv` (file name must be exact)
- The CSV file must be in the same directory as the HTML file
- Password can be changed by editing the HTML file (line ~681: `if (password === 'kirmes2025')`)
- CSV format must include columns: Tag, Standort, Zeit, Aufgabe, Zugewiesene_Personen, Task_ID

## 🛠 Troubleshooting

### No tasks showing up?
- Make sure your CSV file is named exactly `real-data.csv` (case-sensitive)
- CSV file must be in the same directory as the HTML file
- Check that your CSV uses semicolons (`;`) as separators
- The CSV must have these columns: Tag, Standort, Zeit, Aufgabe, Zugewiesene_Personen, Task_ID
- Try opening the developer console (F12) to see any errors

### CSV format requirements:
- File name: `real-data.csv` (exact name required)
- Column delimiter: semicolon (`;`) 
- Required header row with columns: Tag, Standort, Zeit, Aufgabe, Benötigt, Zugewiesen, Status, Zugewiesene_Personen, Task_ID
- Names in Zugewiesene_Personen should be separated by semicolons within quotes (e.g., `"Name1; Name2; Name3"`)
- Example first row: `Tag;Standort;Zeit;Aufgabe;Benötigt;Zugewiesen;Status;Zugewiesene_Personen;Task_ID`

**Ready for production! 🚀**
