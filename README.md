# Basketball Substitution Manager

A React-based web application for managing basketball team substitutions with an intuitive drag-and-drop interface.

## Features

- **Player Management**: Add and remove players from your team
- **Drag & Drop Interface**: Easily move players between bench and court positions
- **5 Court Positions**: Point Guard, Shooting Guard, Small Forward, Power Forward, and Center
- **Substitution Tracking**: Queue up multiple substitutions and execute them all at once
- **Visual Court Layout**: Clear visualization of who's on the court and in which position
- **Responsive Design**: Works on desktop and tablet devices

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BBall-sub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## How to Use

### Adding Players

1. In the left panel, enter a player's name in the "Add Player" input field
2. Click "Add to Team" to add the player to your bench

### Moving Players to Court

**Method 1: Drag and Drop**
1. Click and hold on a player in the bench
2. Drag them to one of the 5 court positions
3. Release to place them on the court

**Method 2: Direct Placement**
1. Simply drag any bench player to an empty court position
2. If you drag a player to an occupied position, they will swap

### Managing Substitutions

**Quick Substitution:**
1. Click the "Sub" button on any player currently on the court
2. Select a bench player from the dropdown menu
3. The substitution will be added to the "Pending Substitutions" panel

**Execute Substitutions:**
1. After adding one or more substitutions to the queue
2. Click "Execute All Substitutions" in the right panel
3. All pending substitutions will be completed simultaneously

### Removing Players

**From Bench:**
- Click the "×" button on any bench player to remove them from the team

**From Court:**
- Click the "×" button on any court player to move them back to the bench

## Project Structure

```
BBall-sub/
├── src/
│   ├── components/
│   │   ├── AddPlayer.jsx        # Component for adding new players
│   │   ├── AddPlayer.css
│   │   ├── Bench.jsx             # Bench display with draggable players
│   │   ├── Bench.css
│   │   ├── Court.jsx             # Court with 5 positions and drop zones
│   │   ├── Court.css
│   │   ├── SubstitutionManager.jsx  # Pending substitutions tracker
│   │   └── SubstitutionManager.css
│   ├── App.jsx                   # Main application component
│   ├── App.css
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML template
├── vite.config.js               # Vite configuration
├── package.json
└── README.md
```

## Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and development server
- **HTML5 Drag and Drop API**: For drag-and-drop functionality
- **CSS3**: For styling and animations

## Browser Support

This application works best on modern browsers that support:
- HTML5 Drag and Drop API
- CSS Grid and Flexbox
- ES6+ JavaScript features

Recommended browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
