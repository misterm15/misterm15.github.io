# Kirmes Dienstplan 2025 - Vite/React Application

This project has been converted from an HTML-based React application to a modern Vite/React TypeScript application.

## Project Structure

```
src/
├── components/
│   ├── LoginPage.tsx       # Login component with password authentication
│   └── TaskViewer.tsx      # Main task viewing component with filters
├── utils/
│   ├── storage.ts          # LocalStorage utilities
│   ├── csvProcessor.ts     # CSV parsing functionality
│   └── taskUtils.ts        # Task filtering and grouping utilities
├── types/
│   ├── index.ts           # TypeScript interfaces
│   └── html2pdf.d.ts      # Type definitions for html2pdf.js
├── App.tsx                # Main application component
├── App.css                # Application styles
├── index.css              # Global styles
└── main.tsx               # Application entry point
public/
└── real-data.csv          # CSV data file
```

## Features

- 🔐 **Password Authentication**: Login with password "kirmes2025"
- 🔍 **Smart Search**: Search by name, filter by day or task
- 📱 **Mobile Responsive**: Optimized for mobile devices with smart header
- 📄 **Export Options**: WhatsApp sharing and PDF export
- 🎨 **Modern UI**: Glass morphism design with smooth animations
- ⚡ **Fast Performance**: Built with Vite for optimal loading

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run serve` - Serve production build on port 4173

## Deployment

### GitHub Pages Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   - The built files are in the `dist/` directory
   - Upload the contents of `dist/` to your GitHub Pages repository
   - Ensure `real-data.csv` is accessible at the root

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload dist/ contents to your web server**

3. **Ensure CSV file is accessible:**
   - The app expects `real-data.csv` to be available at `/real-data.csv`
   - Make sure the CSV file is in the root of your web server

## CSV Data Format

The application expects a CSV file with German column headers:
- `Datum` (Date) - Day of the week (Freitag, Samstag, etc.)
- `Zeit` (Time) - Time in HH:MM format
- `Ort` (Location) - Location name
- `Dienst` (Task) - Task description
- `Name` (Name) - Assigned person name

Example:
```csv
Datum;Zeit;Ort;Aufgabe;Name
Freitag;18:00;Hauptbühne;Technik Setup;Max Mustermann
Samstag;10:00;Kasse;Kassendienst;Anna Schmidt
```

## Configuration

### Password
To change the login password, edit the password in `src/components/LoginPage.tsx`:
```typescript
if (password === 'kirmes2025') {  // Change this password
```

### Styling
- Main styles are in `src/App.css`
- Global styles are in `src/index.css`
- Colors and theme can be customized via CSS variables

### CSV File Location
If you need to change the CSV file location, update the fetch URL in `src/App.tsx`:
```typescript
const response = await fetch(`/real-data.csv?t=${timestamp}&cb=${Math.random()}`, {
```

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Technologies Used

- **Vite** - Build tool and development server
- **React 19** - UI framework
- **TypeScript** - Type safety
- **PapaParse** - CSV parsing
- **html2pdf.js** - PDF export functionality

## Migration Notes

The application has been converted from the original HTML file while maintaining:
- ✅ All original functionality
- ✅ Same visual design and layout
- ✅ Mobile responsiveness
- ✅ CSV processing logic
- ✅ Export features
- ✅ Authentication system

### Key Improvements
- **TypeScript support** for better development experience
- **Component-based architecture** for maintainability
- **Modern build system** with Vite for fast development
- **Better performance** with optimized bundling
- **Improved accessibility** and SEO
- **Development tools** like hot reload and linting
