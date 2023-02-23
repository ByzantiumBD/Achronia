const config = {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		"./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
	],
  
	theme: {
		extend: {
			colors: {
				blue: {
					"1": "#B8FFFB",
					"2": "#5CD0DD",
					"3": "#00A2C0",
					"4": "#0067B6",
					"5": "#002073",
				},
				
				pink: {
					"1": "#E68FDA",
					"2": "#DD3BB1",
					"3": "#E520B0",
					"4": "#932263",
				},
				
				orange:{
					"1": "#F1D033",
					"2": "#E9AC2D",
					"3": "#E2985F",
				},

				myblack: "#1b1b1b"
			},
			backgroundImage: {
				'game': "url('$lib/img/map.png')",
			}
		},
	},
  
	plugins: [
	  	require('flowbite/plugin')
	],
	darkMode: 'class',
  };
  
  module.exports = config;