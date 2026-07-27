# ⬡ PixelVault — Premium Digital Asset Marketplace

Welcome to the **PixelVault** repository! PixelVault is a highly polished, responsive, and modern front-end application for a premium digital asset marketplace. It allows creators and users to browse, search, preview, and purchase high-quality digital assets such as photography, graphics, illustrations, templates, videos, and audio.

## ✨ Features

* **Modern & Responsive UI/UX:** A clean, dark-mode-first aesthetic with a bento-grid layout, glassmorphism effects, and masonry asset grids.
* **Theming:** Built-in dynamic theme toggling (Dark/Light modes) managed via CSS variables.
* **Comprehensive Asset Categories:** Dedicated pages for Photography, Graphics, Illustrations, Templates, Audio, and Videos with specialized filters.
* **Advanced Filtering & Sorting:** Sidebar filtering (by price, license, color, software, genre) and layout toggles (grid vs. list).
* **Interactive Elements:** 
  * "Quick View" modal for instant asset previews.
  * Search overlay triggered via `⌘K` or click.
  * Interactive floating labels and dynamic password strength indicators on auth forms.
  * Interactive credit card preview on checkout.
* **Shopping Cart & Checkout Flow:** A fully designed cart page and a multi-step secure checkout form with various payment method tabs.
* **User Authentication:** Beautiful split-panel Sign In & Sign Up pages featuring particle animations and OAuth buttons.

## 🛠 Tech Stack

PixelVault is built using purely native web technologies, ensuring lightweight performance and zero dependency overhead:
* **HTML5:** Semantic and accessible page structure.
* **CSS3:** Heavy use of CSS variables (Custom Properties), Flexbox, CSS Grid, and custom animations (no external CSS frameworks like Tailwind or Bootstrap).
* **Vanilla JavaScript (ES6+):** For DOM manipulation, modal handling, local storage (cart state), and interactive UI elements.

## 📁 Project Structure

Based on the provided HTML architecture, the project relies on the following directory structure:

```text
├── index.html           # Landing page with hero section & trending carousel
├── category.html        # Generic category/browsing template
├── audio.html           # Audio assets category page
├── graphics.html        # Graphics category page
├── illustrations.html   # Illustrations category page
├── templates.html       # Templates category page
├── cart.html            # Shopping cart overview
├── checkout.html        # Secure payment and checkout process
├── signin.html          # Authentication (Sign In / Create Account)
├── styles/
│   ├── main.css         # Global variables, typography, and base styles
│   ├── components.css   # Buttons, badges, navbar, modals, footers
│   ├── category.css     # Masonry grid, sidebar filters, category strip
│   ├── cart.css         # Cart layouts and empty states
│   └── payment.css      # Checkout form, card preview, progress steps
└── js/
    ├── main.js          # Global scripts (navbar, search modal, theme toggle)
    ├── category.js      # Sorting, filtering, quick view, layout toggle
    ├── cart.js          # Cart logic, local storage sync, promo codes
    └── payment.js       # Checkout form validation, card input masking
```

## 🚀 Getting Started

Since this is a static front-end project, no build step or node package installation is required!

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/pixelvault.git
   ```
2. **Open the project:**
   Simply open `index.html` in your favorite web browser. 
   
   *Tip for Developers:* For the best experience (and to avoid any local CORS issues with JS modules if you add them later), serve the directory using a local web server:
   * Using VS Code: Install the **Live Server** extension and click "Go Live".
   * Using Python: Run `python -m http.server 8000` in the root directory and visit `http://localhost:8000`.

## 🎨 Design Notes

The design language of PixelVault relies on a few key concepts:
* **Muted Accents & Gradients:** The UI uses subtle linear gradients and floating ambient glows to create depth.
* **Component Modularity:** CSS is broken down into specific structural and component layers to make expanding the marketplace easy.
* **Mobile-First Paradigm:** Includes a sticky bottom navigation bar (`<nav class="mobile-nav">`) for mobile users, replacing standard desktop nav elements.

## 📄 License

This project is intended as a premium UI showcase. All rights reserved. 

## Photos of the Software
<img width="1512" height="860" alt="Screenshot 2026-07-27 at 10 20 49 PM" src="https://github.com/user-attachments/assets/d5d0516f-e289-40d8-ab0c-3da91e7e1a58" />

<img width="1510" height="860" alt="Screenshot 2026-07-27 at 10 21 18 PM" src="https://github.com/user-attachments/assets/ad846ee7-f465-4277-b278-997ab591faa7" />

<img width="1512" height="861" alt="Screenshot 2026-07-27 at 10 21 40 PM" src="https://github.com/user-attachments/assets/8d38dfda-7bff-4c38-b165-09c87b7c3123" />


