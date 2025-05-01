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
	css: {
		postcss: {
			plugins: [
				autoprefixer
			]
		}
	}
});
