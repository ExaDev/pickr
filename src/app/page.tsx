export default function Home() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
			<div className="max-w-4xl mx-auto">
				<header className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">{{ APP_NAME }}</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">{{ APP_DESCRIPTION }}</p>
				</header>

				<div className="grid md:grid-cols-2 gap-8 mb-12">
					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">{{ FEATURE_1_TITLE }}</h2>
						<p className="text-gray-600">{{ FEATURE_1_DESCRIPTION }}</p>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">{{ FEATURE_2_TITLE }}</h2>
						<p className="text-gray-600">{{ FEATURE_2_DESCRIPTION }}</p>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">{{ FEATURE_3_TITLE }}</h2>
						<p className="text-gray-600">{{ FEATURE_3_DESCRIPTION }}</p>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">{{ FEATURE_4_TITLE }}</h2>
						<p className="text-gray-600">{{ FEATURE_4_DESCRIPTION }}</p>
					</div>
				</div>

				<div className="text-center">
					<div className="bg-white rounded-lg shadow-md p-8">
						<h3 className="text-2xl font-semibold text-gray-800 mb-4">{{ CTA_TITLE }}</h3>
						<p className="text-gray-600 mb-6">{{ CTA_DESCRIPTION }}</p>
						<button
							type="button"
							className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
						>
							{{ CTA_BUTTON_TEXT }}
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
