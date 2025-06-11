export default function Footer() {
	const version = process.env.NEXT_PUBLIC_APP_VERSION || 'dev';
	const commitHash = process.env.NEXT_PUBLIC_COMMIT_HASH || 'unknown';
	const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || 'unknown';
	const branch = process.env.NEXT_PUBLIC_BRANCH || 'local';

	const isProduction = branch === 'main';
	const shortCommit = commitHash !== 'unknown' ? commitHash.slice(0, 7) : 'unknown';

	return (
		<footer className="bg-gray-50 border-t border-gray-200 mt-auto">
			<div className="max-w-4xl mx-auto px-8 py-6">
				<div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
					<div className="mb-2 sm:mb-0">
						<span className="font-medium">BrainPatch</span>
						<span className="mx-2">•</span>
						<span>Intelligent Learning Platform</span>
						{!isProduction && (
							<>
								<span className="mx-2">•</span>
								<span className="text-orange-600 font-medium">{branch}</span>
							</>
						)}
					</div>
					<div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs">
						<div className="flex items-center gap-4">
							<span className="flex items-center gap-1">
								<span className="text-gray-500">v</span>
								<span className="font-mono font-medium">{version}</span>
							</span>
							<span className="flex items-center gap-1">
								<span className="text-gray-500">#</span>
								<span className="font-mono">{shortCommit}</span>
							</span>
						</div>
						{buildTime !== 'unknown' && (
							<span className="text-gray-500">
								Built {new Date(buildTime).toLocaleDateString()}
							</span>
						)}
					</div>
				</div>
			</div>
		</footer>
	);
}
