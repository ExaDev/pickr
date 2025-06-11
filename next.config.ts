/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',

	// Static export optimizations
	trailingSlash: true,
	skipTrailingSlashRedirect: true,
	images: {
		unoptimized: true, // Required for static export
	},

	// WebAssembly and LLM support
	webpack: (config: { experiments?: object; resolve?: { fallback?: object } }) => {
		// Enable WebAssembly support
		config.experiments = {
			...config.experiments,
			asyncWebAssembly: true,
		};

		// Required for WebLLM browser compatibility
		config.resolve = config.resolve || {};
		config.resolve.fallback = {
			...config.resolve.fallback,
			fs: false,
			path: false,
			crypto: false,
			sharp$: false,
			'onnxruntime-node$': false,
		};

		return config;
	},

	// Note: CORS headers for LLM model loading will need to be configured at deployment level
	// Static export mode doesn't support custom headers configuration

	// Environment variables for static export
	env: {
		NEXT_PUBLIC_APP_NAME: 'BrainPatch',
		NEXT_PUBLIC_APP_VERSION:
			process.env.NEXT_PUBLIC_APP_VERSION || process.env.npm_package_version || 'dev',
		NEXT_PUBLIC_COMMIT_HASH: process.env.NEXT_PUBLIC_COMMIT_HASH || 'unknown',
		NEXT_PUBLIC_BUILD_TIME: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
		NEXT_PUBLIC_BRANCH: process.env.NEXT_PUBLIC_BRANCH || 'local',
	},
};

export default nextConfig;
