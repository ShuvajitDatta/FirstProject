Steps to run this file. 

Step 1 — Install Node.js (if you don't have it)

Download from nodejs.org — pick the LTS version. Verify by opening a terminal/command prompt and running:

node --version
npm --version

Step 2 — Create a new Vite + React project

Open your terminal, navigate to where you want the project, then run:

npm create vite@latest mas-exam -- --template react
cd mas-exam
npm install

Step 3 — Install Tailwind CSS

npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

Step 4 — Configure Tailwind

Open the file tailwind.config.js (in the project root) and replace its contents with:

jsexport default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}

Then open src/index.css and replace everything with:

css@tailwind base;
@tailwind components;
@tailwind utilities;

Step 5 — Drop in the exam app

Delete the existing src/App.jsx and App.css in src
Copy the MAS_Practice_Exam.jsx file I gave you into src/ and rename it to App.jsx
Open src/main.jsx and make sure it imports from ./App (it should already)

Step 6 — Add a fallback for the storage API

The app uses window.storage to save your past attempts. Since that's a specific feature, add this small shim. Open index.html and add this <script> just before </head>:

<script>
  window.storage = {
    get: async (k) => {
      const v = localStorage.getItem(k);
      return v ? { value: v } : null;
    },
    set: async (k, v) => { localStorage.setItem(k, v); return { value: v }; },
    delete: async (k) => { localStorage.removeItem(k); return { deleted: true }; },
  };
</script>

This makes "past attempts" persist in your browser's local storage instead.

Step 7 — Run it

npm run dev

Open the URL it prints (usually http://localhost:5173) in your browser. Done.