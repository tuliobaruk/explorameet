export const getDefaultPasseioImage = () => {
	return "/default-image.png";
};

export const formatPrice = (price: string) => {
	const numPrice = parseFloat(price);
	return `R$ ${numPrice.toFixed(2).replace(".", ",")}`;
};

export const formatDuration = (minutes: number) => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (hours > 0) {
		return `${hours}h${mins > 0 ? ` ${mins}min` : ""}`;
	}
	return `${mins}min`;
};

export const getDefaultAvatar = (name: string) => {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();
	return `https://placehold.co/40x40/898f29/FFFFFF?text=${initials}&font=roboto`;
};

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
	e.currentTarget.src = "/default-image.png";
};
