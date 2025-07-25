export function maskPhone(value: string) {
	return value
		.replace(/\D/g, "")
		.slice(0, 11)
		.replace(/^(\d{2})(\d)/, "($1) $2")
		.replace(/(\d{5})(\d)/, "$1-$2")
		.replace(/(-\d{4})\d+?$/, "$1");
}

export function maskCPF(value: string) {
	return value
		.replace(/\D/g, "")
		.slice(0, 11)
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskCNPJ(value: string) {
	return value
		.replace(/\D/g, "")
		.slice(0, 14)
		.replace(/^(\d{2})(\d)/, "$1.$2")
		.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d)/, ".$1/$2")
		.replace(/(\d{4})(\d)/, "$1-$2")
		.replace(/(-\d{2})\d+?$/, "$1");
}

export function maskCpfCnpj(value: string) {
	const digits = value.replace(/\D/g, "");
	if (digits.length <= 11) {
		return maskCPF(value);
	}
	return maskCNPJ(value);
}

export function maskCadastur(value: string) {
	return value
		.replace(/\D/g, "")
		.slice(0, 11)
		.replace(/(\d{2})(\d)/, "$1.$2")
		.replace(/(\d{2})\.(\d{6})(\d)/, "$1.$2.$3")
		.replace(/(\d{2})\.(\d{6})\.(\d{2})(\d)/, "$1.$2.$3-$4")
		.replace(/(-\d{1})\d+?$/, "$1");
}

export function maskCurrency(value: string) {
	const digits = value.replace(/\D/g, "");
	
	if (!digits) return "";
	
	const limitedDigits = digits.slice(0, 8);
	
	const number = parseInt(limitedDigits, 10) / 100;
	
	return number.toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}
