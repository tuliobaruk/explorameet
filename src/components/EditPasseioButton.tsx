import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePasseioPermissions } from "@/hooks/usePasseioPermissions";

interface EditPasseioButtonProps {
	passeioId: string;
	passeio?: {
		guia?: {
			id: string;
		};
	};
	className?: string;
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
}

export default function EditPasseioButton({
	passeioId,
	passeio,
	className = "",
	variant = "primary",
	size = "md",
}: EditPasseioButtonProps) {
	const navigate = useNavigate();
	const { canEdit } = usePasseioPermissions({ passeio });

	const handleEdit = () => {
		navigate(`/editar-passeio/${passeioId}`);
	};

	if (!canEdit()) {
		return null;
	}

	const getVariantClasses = () => {
		switch (variant) {
			case "primary":
				return "bg-green-600 hover:bg-green-700 text-white border-green-600";
			case "secondary":
				return "bg-gray-600 hover:bg-gray-700 text-white border-gray-600";
			case "outline":
				return "bg-transparent hover:bg-green-50 text-green-600 border-green-600 hover:border-green-700";
			default:
				return "bg-green-600 hover:bg-green-700 text-white border-green-600";
		}
	};

	const getSizeClasses = () => {
		switch (size) {
			case "sm":
				return "px-3 py-1.5 text-sm";
			case "md":
				return "px-4 py-2 text-sm";
			case "lg":
				return "px-6 py-3 text-base";
			default:
				return "px-4 py-2 text-sm";
		}
	};

	return (
		<button
			onClick={handleEdit}
			className={`
				inline-flex items-center gap-2 
				border rounded-lg font-medium
				transition-all duration-200
				focus:outline-none focus:ring-2 focus:ring-green-500/20
				${getVariantClasses()}
				${getSizeClasses()}
				${className}
			`}
			title="Editar passeio"
		>
			<Edit size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />
			Editar
		</button>
	);
}
