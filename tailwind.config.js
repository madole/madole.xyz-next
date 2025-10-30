module.exports = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			handwritten: [
  				'Delius',
  				'cursive'
  			]
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: 0
  				},
  				'100%': {
  					opacity: 1
  				}
  			},
  			horizontalBounce: {
  				'0%': {
  					width: '10px'
  				},
  				'20%': {
  					width: '200px'
  				},
  				'80%': {
  					width: '200px'
  				},
  				'100%': {
  					width: '10px'
  				}
  			}
  		},
  		animation: {
  			fadeIn: 'fadeIn 0.3s ease-in-out',
  			slowFadeIn: 'fadeIn 3s ease-in-out',
  			horizontalBounce: 'horizontalBounce 5s ease-in-out alternate infinite'
  		},
  		colors: {
  			'trello-blue': '#0079BF',
  			'trello-grey': '#EBECF0',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	},
  	maxHeight: {
  		'0': '0',
  		'1/4': '25%',
  		'1/2': '50%',
  		'3/4': '75%',
  		'4/5': '80%',
  		'9/10': '90%',
  		'almost-full': '95%',
  		full: '100%'
  	},
  	gridTemplateColumns: {
  		'16': 'repeat(16, minmax(0, 1fr))',
  		layout: '1fr minmax(100ch, 1fr) 1fr',
  		mobile: 'repeat(auto-fit, minmax(200px, auto))'
  	}
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
