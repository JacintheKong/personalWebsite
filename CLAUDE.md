# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Yejun Kong, a software engineer. The site is built as a static HTML website with no build process or package manager.

## Architecture

**Core Structure:**
- Single-page application with two HTML pages:
  - `index.html` - Main portfolio with sections: Home, Resume, Work, Projects, Contact
  - `weekend-mode.html` - Personal interests/hobby page (hiking)
- Toggle switch between normal and weekend mode in the UI

**Technology Stack:**
- Pure HTML/CSS/JavaScript (no frameworks or build tools)
- Bootstrap for responsive layout
- jQuery for DOM manipulation and animations
- Third-party libraries: Owl Carousel (testimonials), WOW.js (scroll animations), Knob.js (skill percentage visualizations)

**Static Assets:**
- `static/css/` - Stylesheets (bootstrap.css, style.css, responsive.css)
- `static/js/` - JavaScript libraries and custom scripts
- `static/picture/` - Images and icons
- `static/image/` - Additional images (certifications, arrows)
- `static/file/` - Likely contains downloadable files (CV)
- `static/font/` - Font files

**Key JavaScript Files:**
- `custom-script.js` - Main custom JavaScript logic
- `pagenav.js` - Navigation and scroll-based section highlighting
- `other.js` - Additional custom functionality

## Development Workflow

**Running the site:**
Open `index.html` directly in a browser (no build step required). For local development with live reload, you can use any static file server, e.g.:
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000`

**Making changes:**
- Edit HTML files directly for content changes
- CSS customizations go in `static/css/style.css`
- Custom JavaScript logic in `static/js/custom-script.js` or `static/js/other.js`

**No package manager:** This project has no `package.json`, `requirements.txt`, or other dependency files. All libraries are vendored in the `static/` directory.

**Git workflow:**
- Main branch: `main`
- Recent updates include CV updates, certifications, and work experience changes
- The site appears to be deployed directly from the repository

## Content Sections

The portfolio includes:
1. **Home** - Summary, features, skills (with animated percentage bars), testimonials
2. **Resume** - Expertise areas, education (Georgia Tech M.Sc., Columbia M.Sc.), certifications (GCP Cloud Architect, AWS AI Practitioner, GCP Data Engineer), interests
3. **Work** - Experience at MetricStream, Mina, Abel.ai, TinyTalk.ai
4. **Projects** - Enron Scandal fraud detection, License Plate Recognition, BuzzCars, Grocery Express
5. **Contact** - Email, phone, location information

## Important Notes

- CV link points to Google Drive: `https://drive.google.com/file/d/1tG07V-YrXUJa3rsSZU9DjVaq6O0RNkNl/view?usp=drive_link`
- Certification links point to Credly badges
- LinkedIn profile: `https://www.linkedin.com/in/yejunkong/`
- The scroll animations and skill bars use data attributes (`data-percent`, `data-stop`, `data-speed`) that are processed by JavaScript on page load
