"use client";

export default function CreateAdventureSection() {
  return (
    <section className="mt-8 rounded-xl bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 p-8 shadow-lg text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-white">
        Crie sua própria aventura!
      </h2>
      <p className="mt-2 text-gray-100 text-lg">
        Reúna seus amigos, escolha um sistema e dê vida às suas histórias.
      </p>
      <button
        onClick={() => (window.location.href = "/mesas/criar")}
        className="mt-4 px-6 py-3 rounded-lg bg-gray-100 text-gray-900 font-semibold hover:bg-gray-300 transition-colors"
      >
        Criar Mesa
      </button>
    </section>
  );
}