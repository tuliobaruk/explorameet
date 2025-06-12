import { LucideIcon } from "lucide-react";
import { useRef } from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	icon: LucideIcon;
	id: string;
	error?: string;
	maskFunction?: (value: string) => string;
}

export default function AuthInput({
	label,
	icon: Icon,
	id,
	error,
	maskFunction,
	onChange,
	...props
}: AuthInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		let value = e.target.value;
		if (maskFunction) {
			value = maskFunction(value);
			if (inputRef.current) inputRef.current.value = value;
		}
		if (onChange) {
			onChange({
				...e,
				target: {
					...e.target,
					value,
				},
			});
		}
	}

	return (
		<div>
			<label htmlFor={id} className="block font-medium text-verde-oliva text-sm mb-2">
				{label}
			</label>
			<div className="relative mt-1">
				<Icon
					size={18}
					className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none text-marrom-dourado"
				/>
				<input
					id={id}
					ref={inputRef}
					{...props}
					onChange={handleChange}
					className={`block w-full pl-10 pr-3 py-2 text-sm border ${error ? "border-red-500" : "border-verde-oliva/40"} rounded-md shadow-sm bg-white text-verde-oliva placeholder:text-stone-400 focus:outline-none focus:border-verde-vibrante focus:ring-3 focus:ring-verde-vibrante/25 transition-all`}
				/>
			</div>
			{error && <p className="error-message">{error}</p>}
		</div>
	);
}
