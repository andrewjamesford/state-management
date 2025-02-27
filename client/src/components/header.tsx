import { useState } from "react";
import MenuLoggedIn from "~/components/menuLoggedIn";
import MenuLoggedOut from "~/components/menuLoggedOut";
import { getLocalStorageItem, setLocalStorageItem } from "~/utils/localStorage";

/**
 * Header component that displays a navigation header with login/logout functionality.
 * It uses local storage to persist the login state and dynamically loads the appropriate menu
 * based on the login state.
 *
 * @component
 * @example
 * return (
 *   <Header />
 * )
 *
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header() {
	const storageKey = "isLoggedIn";
	const storageIsLoggedIn = getLocalStorageItem(storageKey) || false;
	const [isLoggedIn, setIsLoggedIn] = useState(storageIsLoggedIn);

	const handleLogout = () => {
		setIsLoggedIn(false);
		setLocalStorageItem(storageKey, false);
	};

	const handleLogin = () => {
		setIsLoggedIn(true);
		setLocalStorageItem(storageKey, true);
	};

	return (
		<header className="flex flex-col justify-between border-b bg-white px-4 py-2 md:flex-row">
			<div className="mb-4 text-center md:space-x-4">
				<a
					href="/"
					className="mt-2 inline-flex items-center text-center text-sm text-black"
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
			<div className="flex flex-col gap-4 py-2 text-center md:flex-row md:py-4 md:text-left">
				{isLoggedIn ? (
					<MenuLoggedIn onChange={handleLogout} />
				) : (
					<MenuLoggedOut onChange={handleLogin} />
				)}
			</div>
		</header>
	);
}
