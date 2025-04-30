import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tailwindcss(),
		react()
	],
	optimizeDeps: {
		include: ['react-map-gl', 'mapbox-gl'],
		force: true,
		esbuildOptions: {
			define: {
				global: 'globalThis'
			}
		}
	},
	resolve: {
		alias: {
			'mapbox-gl': 'mapbox-gl/dist/mapbox-gl'
		}
	},
	css: {
		modules: false,
		postcss: {
			plugins: [
				autoprefixer
			]
		}
	},
	build: {
		rollupOptions: {
			external: ['mapbox-gl']
		}
	},
	define: {
		'process.env': {}
	},
	server: {
		host: '0.0.0.0',
		port: 5173,
		strictPort: true,
		hmr: {
			protocol: 'ws',
			host: 'localhost',
			port: 5173,
			clientPort: 5173,
			overlay: false
		}
	}
});
