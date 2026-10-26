# Secure Password Generator

A simple, client-side password generator built with HTML, CSS and JavaScript.
Passwords are generated in the browser with the Web Crypto API
(`crypto.getRandomValues`), so nothing is sent to a server or stored.

## Features
- Length from 8 to 64 characters
- Uppercase, lowercase, numbers and symbols (toggle each)
- Option to exclude look-alike characters (`O`, `0`, `l`, `1`, `I`)
- At least one character from every selected type
- Unbiased random selection (rejection sampling, no modulo bias)
- Strength meter based on entropy
- One-click copy
- Light and dark mode, responsive layout

## Run locally
Open `index.html` in a browser, or use the VS Code **Live Server** extension.

## Project structure
```
secure-password-generator/
├── index.html
├── style.css
├── script.js
├── README.md
├── LICENSE
└── .gitignore
```

## Deploy with GitHub Pages
1. Push the project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Branch**, choose `main` and `/ (root)`, then save.

## Author
Vishal Jamadar

## License
MIT
