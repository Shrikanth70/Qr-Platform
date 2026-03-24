import OptionCard from '../components/OptionCard'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 animate-in fade-in zoom-in-95 duration-700 w-full">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-semibold tracking-widest uppercase">
            Platform 2.0
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight drop-shadow-2xl">
            Intelligent QR{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Generation
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Create stunning customized QR codes instantly and verify structured certificates with total confidence, all in one seamless workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <OptionCard
            title="Generate Code"
            description="Create rich QR codes for websites or file links. Customize your visual patterns, colors, and insert logos dynamically."
            buttonText="Create QR"
            to="/generate"
          />
          <OptionCard
            title="Verify & Decode"
            description="Upload a QR image to immediately decode it, verify its authenticity, and view structured certificate payload data."
            buttonText="Verify QR"
            to="/verify"
          />
        </div>
      </div>
      
    </div>
  )
}

export default Home