import { Link } from 'react-router-dom'

function OptionCard({ title, description, buttonText, to }) {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/60 transition-all duration-300 group shadow-lg flex flex-col h-full">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-blue-400 transition-colors">{title}</h2>
        <p className="text-slate-400 mb-8 leading-relaxed font-medium">{description}</p>
      </div>
      <div>
        <Link
          to={to}
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.15)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] backdrop-blur-sm tracking-wide"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  )
}

export default OptionCard