function PatternCard({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
        selected
          ? 'border-blue-500 bg-blue-500/20 text-blue-100 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
          : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
      }`}
    >
      <div className="font-semibold">{label}</div>
    </button>
  )
}

export default PatternCard