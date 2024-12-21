import ErrorMessage from "~/components/errorMessage";
import Footer from "~/components/footer";

/**
 * ErrorPage component renders a full-page error message with a header and footer.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.message="An error occurred"] - The error message to display.
 * @returns {JSX.Element} The rendered ErrorPage component.
 */
export default function ErrorPage({ message = "An error occured" }) {
	return (
		<div className="w-full flex flex-row place-content-center bg-gray-100">
			<div className="w-11/12 max-w-7xl min-h-screen flex flex-col ">
				<div className="bg-gray-100 h-full">
					<header className="flex flex-col md:flex-row justify-between px-4 py-2 bg-white border-b">
						<div className="text-center mb-4 md:space-x-4">
							<a
								href="/"
								className="text-sm text-black text-center inline-flex items-center mt-2"
							>
								<img
									src="/gavel.svg"
									alt="Logo"
									width="32"
									height="32"
									className="inline w-20 md:w-10"
								/>
								<span className="text-3xl md:text-lg">SOLD!</span>
							</a>
						</div>
					</header>
					<main className="px-4 py-8 bg-white">
						<ErrorMessage message={message} />
					</main>
				</div>
				<Footer />
			</div>
		</div>
	);
}
