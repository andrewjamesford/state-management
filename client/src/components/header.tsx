import Loader from "@/components/loader";
import { getPageAndPath } from "@/utils/getPageAndPath";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/localStorage";
import { usePath } from "crossroad";
import React, { lazy, Suspense, useState } from "react";
const MenuLoggedIn = lazy(() => import("@/components/menuLoggedIn"));
const MenuLoggedOut = lazy(() => import("@/components/menuLoggedOut"));

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
	const path = usePath();
	const { page } = getPageAndPath(path);
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

	const single = page === "single" ? "font-bold" : "";
	const simple = page === "simple" ? "font-bold" : "";
	const multi = page === "multi" ? "font-bold" : "";
	return (
		<>
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
				<div className="flex flex-col text-center md:flex-row md:text-left gap-4 py-2 md:py-4">
					<Suspense fallback={<Loader />}>
						{isLoggedIn ? (
							<MenuLoggedIn
								menuProps={{ single, multi, simple }}
								onChange={handleLogout}
							/>
						) : (
							<MenuLoggedOut onChange={handleLogin} />
						)}
					</Suspense>
				</div>
			</header>
		</>
	);
}
