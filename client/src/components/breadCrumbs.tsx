import { useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * NavItem component renders a navigation item with a link or a span based on its active state.
 *
 * @param {Object} props - The component props.
 * @param {string} props.href - The URL to navigate to.
 * @param {boolean} props.isActive - Indicates if the navigation item is active.
 * @param {React.ReactNode} props.children - The content to be displayed inside the navigation item.
 * @returns {JSX.Element} The rendered navigation item.
 */

interface NavItemProps {
	href: string;
	isActive: boolean;
	children: ReactNode;
}

function NavItem({ href, isActive, children }: NavItemProps) {
	return (
		<div>
			{isActive ? (
				<a href={href} className={"font-semibold underline"}>
					{children}
				</a>
			) : (
				<span className="text-slate-400">{children}</span>
			)}
			<span className="text-slate-400">&nbsp;&gt;</span>
		</div>
	);
}
/**
 * BreadCrumbs component renders a breadcrumb navigation based on the current step.
 *
 * @param {Object} props - The component props.
 * @param {number} props.currentStep - The current step in the breadcrumb navigation.
 * @returns {JSX.Element} The rendered breadcrumb navigation.
 */
interface BreadCrumbsProps {
	currentStep: number;
}

export default function BreadCrumbs({ currentStep }: BreadCrumbsProps) {
	const location = useLocation();
	const pathname = location.pathname || "";
	const pathParts = pathname.split("/").filter(Boolean);
	const page = pathParts[0] || "redux";
	const step = currentStep.toString();

	const steps = [
		{ href: `/${page}/1`, label: "Title & Category" },
		{ href: `/${page}/2`, label: "Item Details" },
		{ href: `/${page}/3`, label: "Price & Payment" },
		{ href: `/${page}/4`, label: "Shipping & Pick-up" },
		{ href: `/${page}/5`, label: "Review & Submit" },
	];

	return (
		<nav className="invisible md:visible flex items-center space-x-2 text-sm text-gray-600">
			{steps.map((item, index) => (
				<NavItem
					key={item.label}
					href={item.href}
					isActive={step === (index + 1).toString()}
				>
					{item.label}
				</NavItem>
			))}
		</nav>
	);
}
