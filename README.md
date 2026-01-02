# Anaya Maheshwari - Portfolio Website

This is the vanilla HTML/CSS/JavaScript version of the portfolio website, ready for GitHub Pages deployment.

## Files Included

- `index.html` - Main HTML structure
- `styles.css` - All styling and responsive design
- `script.js` - All JavaScript functionality and animations
- `clover-stalk.png` - Clover stalk image (need to add)
- `clover-leaves.png` - Clover leaves image (need to add)

## Setup Instructions

### 1. Export Clover Images

You need to export the two clover images from your Figma assets:

**From your React project**, the images are referenced as:
- Stalk: `figma:asset/6e6db7a5dacd2d2efa71c5154331a916f76ea825.png`
- Leaves: `figma:asset/4a2e6167279954209b8f943ee89a04b955cbaaa8.png`

Save these images in the `/export` folder as:
- `clover-stalk.png`
- `clover-leaves.png`

### 2. GitHub Pages Deployment

1. Create a new repository on GitHub (e.g., `portfolio`)
2. Upload all files from this `/export` folder to the repository
3. Go to repository Settings → Pages
4. Under "Source", select the main branch
5. Click Save
6. Your site will be live at `https://yourusername.github.io/portfolio/`

## Features

✅ Interactive clover logo that rotates slowly and speeds up when scrolling
✅ Smooth scrolling text that changes speed based on scroll
✅ Responsive design for mobile and desktop
✅ Clean project list layout with tags and descriptions
✅ Smooth transitions between landing page and work section
✅ Custom scrollbar styling
✅ IBM Plex Mono font (via Google Fonts)
✅ RGB blue (#2A00FF) and white color scheme
✅ Clickable clover to reload page
✅ "anaya" link with reverse underline behavior (shows on hover)
✅ Navigation links with underline that disappears on hover
✅ Footer with Email, LinkedIn, and Instagram links

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
  --blue: #2A00FF;
  --white: #FFFFFF;
}
```

### Projects
Edit the `projects` array in `script.js` to add/remove/modify projects.

### Scrolling Text
Edit the `scrollingWords` array in `script.js` to change the scrolling text content.

## Notes

- The website uses smooth scrolling and CSS transitions for all animations
- Clover rotation and text scrolling use `requestAnimationFrame` for smooth 60fps animations
- Mobile breakpoint is set at 1024px
- Font fallback: IBM Plex Mono → monospace
- All animations respect the user's scroll direction

## Contact

For questions or modifications, contact Anaya Maheshwari:
- Email: anaya.maheshwari@gmail.com
- LinkedIn: https://www.linkedin.com/in/anayamaheshwari/
- Instagram: https://www.instagram.com/anayamhw
