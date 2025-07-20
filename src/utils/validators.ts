export const isValidPlan = (plan: any): boolean => {
	return (
		plan &&
		typeof plan === "object" &&
		typeof plan.id === "string" &&
		typeof plan.nome === "string" &&
		(typeof plan.preco === "string" || typeof plan.preco === "number") &&
		typeof plan.role === "string" &&
		["GUIA", "CLIENTE"].includes(plan.role.toUpperCase()) &&
		typeof plan.descricao === "string" &&
		typeof plan.duracao_dias === "number" &&
		typeof plan.stripe_product_id === "string" &&
		typeof plan.stripe_price_id === "string" &&
		typeof plan.ativo === "boolean"
	);
};

export const isValidUUID = (uuid: string): boolean => {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidRegex.test(uuid);
};
