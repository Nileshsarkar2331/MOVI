/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        movi: {
          background: '#080A0F',
          surface: '#11141C',
          elevated: '#191D27',
          glass: 'rgba(17, 22, 34, 0.78)',
          primary: '#31F5A5',
          secondary: '#58B7FF',
          electric: '#8E7CFF',
          text: '#F6F7FB',
          muted: '#A8B0C2',
          subtle: '#7F8A9F',
          border: '#252B38',
          danger: '#FF5A7A',
          warning: '#FFCE6A'
        }
      },
      borderRadius: {
        panel: '24px',
        sheet: '32px'
      },
      spacing: {
        screen: '20px'
      }
    }
  },
  plugins: []
};
