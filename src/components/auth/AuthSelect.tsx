import { LucideIcon } from "lucide-react";
import React from "react";

interface AuthSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label: string;
	id: string;
	error?: string;
	icon?: LucideIcon;
}

export default function AuthSelect({
	label,
	id,
	error,
	icon: Icon,
	children,
	...props
}: AuthSelectProps) {
	return (
		<div>
			<label htmlFor={id} className="block font-medium text-verde-oliva text-sm mb-2">
				{label}
			</label>
			<div className="relative mt-1">
				{Icon && (
					<Icon
						size={18}
						className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none text-marrom-dourado"
					/>
				)}
				<select
					id={id}
					{...props}
					className={`block w-full pl-10 pr-3 py-2 text-sm border ${
						error ? "border-red-500" : "border-verde-oliva/40"
					} rounded-md shadow-sm bg-white text-verde-oliva placeholder:text-stone-400 focus:outline-none focus:border-verde-vibrante focus:ring-3 focus:ring-verde-vibrante/25 transition-all`}
				>
					{children}
				</select>
			</div>
			{error && <p className="error-message">{error}</p>}
		</div>
	);
}
