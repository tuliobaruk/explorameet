import { Passeio } from "@/services/passeioService";
import { formatDuration, formatPrice, getDefaultAvatar, handleImageError } from "@/utils/utils";
import {
  Banknote,
  Clock,
  MessageSquare,
  Mountain,
  Share2,
  Star,
  ThumbsUp,
  Users,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Categories: React.FC<{ categorias: Passeio["categorias"] }> = ({ categorias }) => {
	if (!categorias || categorias.length === 0) return null;

	return (
		<div className="flex flex-wrap gap-2 mt-3">
			{categorias.map((categoria) => {
				if (!categoria || !categoria.id || !categoria.nome) return null;

				return (
					<span
						key={categoria.id}
						className="px-2 py-1 text-xs rounded-full border"
						style={{
							backgroundColor: "rgba(130, 181, 91, 0.1)",
							color: "rgba(130, 181, 91, 0.8)",
							borderColor: "rgba(130, 181, 91, 0.2)",
						}}
					>
						{categoria.nome}
					</span>
				);
			})}
		</div>
	);
};

const StarRating: React.FC<{ rating: number; total: number }> = ({ rating, total }) => {
	if (total === 0) return null;

	return (
		<div className="flex items-center gap-1 text-sm text-gray-600">
			<Star size={14} className="fill-yellow-400 text-yellow-400" />
			<span>
				{rating} ({total} avaliações)
			</span>
		</div>
	);
};

const preparePasseioImages = (
	imagens: Array<{ url_imagem?: string; descricao?: string }> | undefined,
	passeioTitulo: string,
) => {
	const defaultImage = "/default-image.png";
	const imagesToShow = [];

	for (let i = 0; i < 3; i++) {
		if (imagens && imagens[i] && imagens[i].url_imagem) {
			imagesToShow.push({
				url: imagens[i].url_imagem,
				alt: imagens[i].descricao || passeioTitulo,
			});
		} else {
			imagesToShow.push({
				url: defaultImage,
				alt: `Imagem padrão para ${passeioTitulo}`,
			});
		}
	}

	return imagesToShow;
};

interface PasseioCardProps {
	passeio: Passeio;
}

export const PasseioCard: React.FC<PasseioCardProps> = ({ passeio }) => {
	const imagesToShow = preparePasseioImages(passeio.imagens, passeio.titulo);
	const formattedPrice = formatPrice(passeio.valor);

	return (
		<article
			key={passeio.id}
			className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-[rgba(137,143,41,0.1)]"
		>
			<div className="p-4 lg:p-5">
				<Link
					to={`/guia/${passeio.guia.id}`}
					className="flex items-start gap-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200"
				>
					<img
						src={passeio.guia.perfil.foto || getDefaultAvatar(passeio.guia.perfil.nome)}
						alt={passeio.guia.perfil.nome}
						className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border-2"
						style={{ borderColor: "rgba(130, 181, 91, 0.3)" }}
						onError={(e) => (e.currentTarget.src = getDefaultAvatar(passeio.guia.perfil.nome))}
					/>
					<div className="flex-1 min-w-0">
						<h2
							className="text-lg lg:text-xl font-bold mb-1 line-clamp-2"
							style={{ color: "var(--verde-oliva)" }}
						>
							{passeio.titulo}
						</h2>
						<p className="text-sm font-medium mb-2" style={{ color: "var(--marrom-dourado)" }}>
							Por: {passeio.guia.perfil.nome}
						</p>

						<div className="flex flex-wrap items-center gap-3 text-xs lg:text-sm text-gray-600 mb-2">
							<span className="flex items-center gap-1">
								<Clock size={14} className="text-green-700" />{" "}
								{formatDuration(passeio.duracao_passeio)}
							</span>
							{passeio.valor ? (
								<span className="flex items-center gap-1">
									<Banknote size={14} className="text-green-700" /> {formattedPrice}
								</span>
							) : (
								<span className="flex items-center gap-1">
									<Banknote size={14} className="text-green-700" /> Entre em contato
								</span>
							)}
							{passeio.qtd_pessoas && (
								<span className="flex items-center gap-1">
									<Users size={14} className="text-green-700" /> {passeio.qtd_pessoas} pessoas
								</span>
							)}
							{passeio.nivel_dificuldade && (
								<span className="flex items-center gap-1">
									<Mountain size={14} className="text-green-700" />
									Nível {passeio.nivel_dificuldade}/10
								</span>
							)}
						</div>

						<StarRating rating={passeio.mediaAvaliacoes} total={passeio.quantidadeAvaliacoes} />
					</div>
				</Link>
			</div>

			<Link to={`/passeio/${passeio.id}`}>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
					<div className="sm:col-span-2 lg:col-span-2 sm:row-span-2">
						<img
							src={imagesToShow[0].url}
							alt={imagesToShow[0].alt}
							className="w-full h-48 sm:h-64 lg:h-80 object-cover"
							onError={handleImageError}
						/>
					</div>

					<div className="hidden sm:block">
						<img
							src={imagesToShow[1].url}
							alt={imagesToShow[1].alt}
							className="w-full h-32 lg:h-40 object-cover"
							onError={handleImageError}
						/>
					</div>
					<div className="hidden sm:block">
						<img
							src={imagesToShow[2].url}
							alt={imagesToShow[2].alt}
							className="w-full h-32 lg:h-40 object-cover"
							onError={handleImageError}
						/>
					</div>
				</div>

				<div className="p-4 lg:p-5">
					<p
						className="leading-relaxed mb-3 text-sm lg:text-base line-clamp-3"
						style={{ color: "var(--verde-oliva)" }}
					>
						{passeio.descricao}
					</p>
					<Categories categorias={passeio.categorias} />
				</div>
			</Link>

			<div
				className="px-4 lg:px-5 py-3 border-t"
				style={{ borderColor: "rgba(137, 143, 41, 0.15)" }}
			>
				<div className="flex items-center gap-6">
					<button
						className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-green-50"
						style={{ color: "var(--marrom-dourado)" }}
					>
						<ThumbsUp size={18} />
						<span className="text-sm font-medium">Curtir</span>
					</button>
					<button
						className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-green-50"
						style={{ color: "var(--marrom-dourado)" }}
					>
						<MessageSquare size={18} />
						<span className="text-sm font-medium">Comentar</span>
					</button>
					<button
						className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-green-50"
						style={{ color: "var(--marrom-dourado)" }}
					>
						<Share2 size={18} />
						<span className="text-sm font-medium">Compartilhar</span>
					</button>
				</div>
			</div>
		</article>
	);
};
