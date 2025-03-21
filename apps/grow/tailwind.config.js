const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

module.exports = {
  darkMode: ['class'],
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0, 0%, 100%)',
        foreground: 'hsl(222.2, 47.4%, 11.2%)',
        card: 'hsl(0, 0%, 100%)',
        'card-foreground': 'hsl(222.2, 47.4%, 11.2%)',
        popover: 'hsl(0, 0%, 100%)',
        'popover-foreground': 'hsl(222.2, 47.4%, 11.2%)',
        primary: 'hsl(240, 100%, 40%)',
        'primary-foreground': 'hsl(0, 0%, 100%)',
        secondary: 'hsl(200, 15%, 40%)',
        'secondary-foreground': 'hsl(0, 0%, 20%)',
        muted: 'hsl(0, 0%, 60%)',
        'muted-foreground': 'hsl(0, 0%, 40%)',
        accent: 'hsl(180, 70%, 60%)',
        'accent-foreground': 'hsl(0, 0%, 10%)',
        destructive: 'hsl(0, 70%, 50%)',
        'destructive-foreground': 'hsl(0, 100%, 90%)',
        border: 'hsl(210, 20%, 90%)',
        input: 'hsl(210, 20%, 90%)',
        ring: 'hsl(200, 90%, 50%)',
        'chart-1': 'hsl(40, 100%, 60%)',
        'chart-2': 'hsl(200, 80%, 40%)',
        'chart-3': 'hsl(260, 70%, 50%)',
        'chart-4': 'hsl(100, 70%, 50%)',
        'chart-5': 'hsl(350, 70%, 50%)',
        sidebar: 'hsl(0, 0%, 100%)',
        'sidebar-foreground': 'hsl(222.2, 47.4%, 11.2%)',
        'sidebar-primary': 'hsl(240, 100%, 40%)',
        'sidebar-primary-foreground': 'hsl(0, 0%, 100%)',
        'sidebar-accent': 'hsl(180, 70%, 60%)',
        'sidebar-accent-foreground': 'hsl(0, 0%, 10%)',
        'sidebar-border': 'hsl(210, 20%, 90%)',
        'sidebar-ring': 'hsl(200, 90%, 50%)',
      },
      borderRadius: {
        DEFAULT: '0.625rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
