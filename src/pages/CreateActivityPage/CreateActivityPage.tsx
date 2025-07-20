import { Link } from "react-router-dom";
import { ArrowLeft, ImageUp } from "lucide-react";

// Suponha que temos um Header para usuários logados
// import HeaderLogado from "../../components/HeaderLogado";

import "./CreateActivityPage.css";

export default function CreateActivityPage() {
	return (
		<div className="create-activity-container flex min-h-screen flex-col items-center">
			{/* <HeaderLogado /> */}

			<main className="w-full flex flex-col items-center max-w-4xl mx-auto mt-10 md:mt-20 px-4">
				<div className="w-full">
					<Link to="/perfil" className="back-link flex items-center gap-2 font-semibold mb-6">
						<ArrowLeft size={20} />
						Voltar para o Perfil
					</Link>
				</div>

				<div className="form-card w-full bg-white p-8 rounded-lg shadow-xl">
					<h1 className="form-title text-3xl font-bold mb-6">Criar Nova Atividade</h1>

					<form className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Coluna da Esquerda */}
						<div className="col-span-1 flex flex-col gap-6">
							<div>
								<label htmlFor="title" className="form-label">
									Título da Atividade
								</label>
								<input
									type="text"
									id="title"
									className="form-input"
									placeholder="Ex: Travessia da Serra Fina"
								/>
							</div>

							<div>
								<label htmlFor="description" className="form-label">
									Descrição Detalhada
								</label>
								<textarea
									id="description"
									rows={5}
									className="form-input"
									placeholder="Conte sobre o roteiro, o que está incluso, etc."
								></textarea>
							</div>

							<div>
								<label htmlFor="location" className="form-label">
									Localização (Cidade/Estado)
								</label>
								<input
									type="text"
									id="location"
									className="form-input"
									placeholder="Ex: Passa Quatro, MG"
								/>
							</div>

							<div>
								<label htmlFor="difficulty" className="form-label">
									Nível de Dificuldade
								</label>
								<select id="difficulty" className="form-input">
									<option>Fácil</option>
									<option>Moderado</option>
									<option>Difícil</option>
									<option>Muito Difícil</option>
								</select>
							</div>
						</div>

						{/* Coluna da Direita */}
						<div className="col-span-1 flex flex-col gap-6">
							<div>
								<label htmlFor="date" className="form-label">
									Data e Hora
								</label>
								<input type="datetime-local" id="date" className="form-input" />
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label htmlFor="duration" className="form-label">
										Duração (horas)
									</label>
									<input type="number" id="duration" className="form-input" placeholder="Ex: 8" />
								</div>
								<div>
									<label htmlFor="maxParticipants" className="form-label">
										Vagas
									</label>
									<input
										type="number"
										id="maxParticipants"
										className="form-input"
										placeholder="Ex: 10"
									/>
								</div>
							</div>

							<div>
								<label htmlFor="price" className="form-label">
									Preço por Pessoa (R$)
								</label>
								<input type="number" id="price" className="form-input" placeholder="Ex: 250.00" />
							</div>

							<div>
								<label className="form-label">Imagens da Atividade</label>
								<div className="image-upload-zone mt-1 flex justify-center items-center flex-col px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
									<ImageUp size={48} className="text-gray-400" />
									<p className="text-sm text-gray-500 mt-2">
										Arraste e solte ou <span className="text-blue-600">clique para enviar</span>
									</p>
									<input type="file" id="images" multiple className="sr-only" />
								</div>
							</div>
						</div>

						{/* Botão de Envio */}
						<div className="md:col-span-2 mt-4">
							<button
								type="submit"
								className="form-submit-button w-full text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
							>
								Publicar Atividade
							</button>
						</div>
					</form>
				</div>
			</main>

			<footer className="footer w-full py-6 mt-24">
				<div className="flex flex-col items-center max-w-full mx-auto px-4 md:px-10 text-white">
					<span>Copyright ©2025 ExploraMeet. Todos os direitos reservados.</span>
				</div>
			</footer>
		</div>
	);
}
