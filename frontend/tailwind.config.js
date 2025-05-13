/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                sidebar: '#5CA1E6',
                background: '#f8f9fa',
                navbar: '#f2f4f6',
            },
        },
    },
    plugins: [],
};