import { Crown, Star, ThumbsUp } from "lucide-react";
import React from "react";

interface Inscricao {
	id: string;
	data_inicio: string;
	data_fim: string;
	status: string;
	planoAssinatura: {
		id: string;
		nome: string;
		preco: string;
		descricao: string;
	};
}

interface Usuario {
	inscricoes?: Inscricao[];
}

interface PlanBadgeProps {
	usuario?: Usuario;
	size?: "sm" | "md" | "lg";
	width?: string;
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({
	usuario,
	size = "sm",
	width = "fit-content",
}) => {
	const getActivePlan = () => {
		if (!usuario) return null;
		
		const inscricoes = usuario.inscricoes;
		if (!inscricoes || inscricoes.length === 0) {
			return null;
		}

		const activeInscricao = inscricoes.find(
			(inscricao) => inscricao.status === "ativa" && new Date(inscricao.data_fim) > new Date(),
		);

		return activeInscricao ? activeInscricao.planoAssinatura : null;
	};

	const getPlanBadge = (planName: string) => {
		const planStyles = {
			"Plano Basic": {
				color: "#6b7280",
				bg: "#f3f4f6",
				icon: ThumbsUp,
				label: "Plano Basic",
			},
			"Plano Pro": {
				color: "#2563eb",
				bg: "#dbeafe",
				icon: Star,
				label: "Plano Pro",
			},
			"Plano Premium": {
				color: "#ca8a04",
				bg: "#fef3c7",
				icon: Crown,
				label: "Plano Premium",
			},
		};

		return planStyles[planName as keyof typeof planStyles] || planStyles["Plano Basic"];
	};

	const activePlan = getActivePlan();

	if (!activePlan) {
		return null;
	}

	const planBadge = getPlanBadge(activePlan.nome);
	const IconComponent = planBadge.icon;

	const sizeStyles = {
		sm: {
			text: "text-xs",
			padding: "px-2 py-1",
			icon: 12,
		},
		md: {
			text: "text-sm",
			padding: "px-3 py-1",
			icon: 14,
		},
		lg: {
			text: "text-base",
			padding: "px-4 py-2",
			icon: 16,
		},
	};

	const currentSize = sizeStyles[size];

	return (
		<div
			className={`flex items-center gap-1 rounded-full font-semibold ${currentSize.text} ${currentSize.padding}`}
			style={{
				backgroundColor: planBadge.bg,
				color: planBadge.color,
				width: width,
			}}
		>
			<IconComponent size={currentSize.icon} />
			<span>{planBadge.label}</span>
		</div>
	);
};
