# Premier Schools Exhibition – Landing Page

## Stack

- Semantic HTML5
- Custom CSS with BEM naming (no frameworks)
- Vanilla JavaScript for interactive components

## Project Structure

```
pse-landing-page/
├── index.html
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── base.css
│   ├── main.css
│   └── blocks/          # BEM component styles
├── js/
│   ├── slider.js        # Accessible carousel utility
│   └── main.js          # Page initialisation
└── assets/images/       # Replace placeholders with real assets
```

## Getting Started

Serve the folder with any static server:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Open `http://localhost:8080` in your browser.

## Replacing Placeholder Images

Drop your exported Figma assets into `assets/images/` and update `index.html` `src` paths:


| Placeholder       | Replace with                            |
| ----------------- | --------------------------------------- |
| `placeholder.svg` | Hero child photos, category card images |
| `logo-pse.svg`    | Official PSE logo                       |
| `school-*.svg`    | Participating school logos              |
| `icon-*.svg`      | Exhibition section icons                |


## Interactive Sections


| Section               | Desktop                                                                            | Mobile                                |
| --------------------- | ---------------------------------------------------------------------------------- | ------------------------------------- |
| **Hero**              | Dual-axis slider: horizontal text/gallery slides + vertical scrolling pill columns | Stacked layout, swipe enabled         |
| **School Logos**      | Continuous marquee, alternating LTR / RTL rows                                     | Same, pauses on hover/focus           |
| **Choose the School** | 4-card grid                                                                        | Swipeable slider with pagination dots |
| **Exhibition**        | Multi-card carousel (2–3 visible)                                                  | Single-card slider                    |


All sliders support keyboard navigation (`←` `→` `Home` `End`), touch swipe, pause on hover/focus, and honour `prefers-reduced-motion`.

## QA Checklist

### HTML/CSS Validation

```bash
# Install validator (one-time)
npm install -g html-validator-cli w3c-css-validator

# Validate HTML
html-validator --file=index.html

# Validate CSS (validate each file or use online W3C CSS Validator)
```

### Accessibility (axe)

```bash
npm install -g @axe-core/cli
axe http://localhost:8080
```

Target: **WCAG 2.2 AA** with zero critical violations.

### Cross-Browser Testing

Test on:

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- iOS Safari, Chrome Android

### Reduced Motion

Enable "Reduce motion" in OS settings and verify:

- Marquee animations stop
- Hero vertical columns stop scrolling
- Slider autoplay is disabled

## BEM Naming Reference

```
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

Examples: `.hero__title`, `.logos-marquee__track`, `.choose-school__card--active`