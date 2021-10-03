const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'Jit',
  // Configure Tailwind to remove unused styles in production
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      purple: colors.purple,
      yellow: colors.yellow,
      red: colors.red,
      pink: '#D83294',
      moss: '#7e826b',
      peach: '#f1a488',
      gray: {
        100: '#efefef',
        150: '#e0e0e0',
        200: '#dddddd',
        300: '#c9c9c9',
        500: '#6B7280',
        600: '#848484',
      },
      green: {
        200: '#A7F3D0',
      },
      lime: '#e1f88f',
      darkyellow: '#f19c42',
      jade: '#b1b794',
      mint: '#d4dcb1',
    },
    zIndex: {
      0: 0,
      1: 1,
      10: 10,
      20: 20,
      30: 30,
      40: 40,
      50: 50,
      25: 25,
      50: 50,
      75: 75,
      100: 100,
      997: 997,
      998: 998,
      999: 999,
      auto: 'auto',
    },
    minWidth: {
      0: '0',
      10: '10rem',
      16: '4rem',
      20: '20rem',
      '1/5': '20%',
      '1/12': '8.333333%',
      '2/12': '16.666667%',
      '3/12': '25%',
      '4/12': '33.333333%',
      '5/12': '41.666667%',
      '6/12': '50%',
      '7/12': '58.333333%',
      '8/12': '66.666667%',
      '9/12': '75%',
      '10/12': '83.333333%',
      '11/12': '91.666667%',
      full: '100%',
    },
    screens: {
      sm: '320px',
      md: '735px',
      lg: '1069px',
    },
    extend: {
      width: {
        160: '40rem',
        128: '32rem',
        92: '23rem',
        88: '22rem',
      },
      height: {
        "75v": '75vh',
        196: '49rem',
        160: '40rem',
        144: '36rem',
        128: '32rem',
        120: '30rem',
        112: '28rem',
      },
      minHeight: {
        196: '49rem',
        144: '36rem',
        main: 'calc(100vh - 64px - 297px)',
      },
      inset: {
        '5/8': '62.5%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
        '5/17': '85%',
      },
      transitionProperty: {
        width: 'width',
        height: 'height',
        colors: 'colors',
      },
      transitionDuration: {
        0: '0ms',
        2000: '2000ms',
        10000: '10000ms',
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ['first', 'last'],
      display: ['group-hover'],
      placeholderColor: ['group-hover'],
      textColor: ['active'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
