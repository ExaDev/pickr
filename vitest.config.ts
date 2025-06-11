import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/test/setup.ts',
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		exclude: ['node_modules', 'out', '.next'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'json-summary', 'html', 'lcov', 'text-summary'],
			exclude: [
				'node_modules/',
				'src/test/',
				'src/**/*.d.ts',
				'src/**/*.test.{js,ts,jsx,tsx}',
				'src/**/*.spec.{js,ts,jsx,tsx}',
				'src/**/*.stories.{js,ts,jsx,tsx}',
				'src/stories/**',
				'src/types/**',
				'**/*.config.{js,ts}',
				'**/coverage/**',
				'**/dist/**',
				'**/out/**',
			],
			thresholds: {
				global: {
					statements: 20,
					branches: 70,
					functions: 45,
					lines: 20,
				},
				perFile: {
					statements: 15,
					branches: 50,
					functions: 30,
					lines: 15,
				},
			},
			reportsDirectory: './coverage',
			all: true,
			include: ['src/**/*.{js,ts,jsx,tsx}'],
			clean: true,
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
});
