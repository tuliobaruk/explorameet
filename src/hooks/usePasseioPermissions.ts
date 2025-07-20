import { useUser } from "@/hooks/useAuth";

interface PasseioPermissionProps {
	passeio?: {
		guia?: {
			id: string;
		};
	};
}

export function usePasseioPermissions(props: PasseioPermissionProps) {
	const { user, isAdmin, isGuide, guiaInfo } = useUser();

	const canEdit = () => {
		if (!user) return false;
		
		if (isAdmin()) return true;
		
		if (isGuide()) {
			const userGuiaId = guiaInfo?.id;
			const passeioGuiaId = props.passeio?.guia?.id;
			
			if (!userGuiaId || !passeioGuiaId) {
				return false;
			}
			
			return userGuiaId === passeioGuiaId;
		}
		
		return false;
	};

	const canDelete = () => {
		return canEdit();
	};

	const canManageSchedules = () => {
		return canEdit();
	};

	const isOwner = () => {
		if (!user || !isGuide()) return false;
		
		const userGuiaId = guiaInfo?.id;
		const passeioGuiaId = props.passeio?.guia?.id;
		
		return userGuiaId === passeioGuiaId;
	};

	return {
		canEdit,
		canDelete,
		canManageSchedules,
		isOwner,
		isAdmin: isAdmin(),
		isGuide: isGuide(),
		userGuiaId: guiaInfo?.id,
	};
}