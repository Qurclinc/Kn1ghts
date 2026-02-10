import team from './assets/participants.json'
import MemberCard from './components/MemberCard'
import logo from './assets/logo.png'
import './style.css'

function App() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-black text-neon font-ui">
      <div className="bg-cyber" />
      {/* Header */}
      <header className="flex flex-col items-center mt-20 mb-14 px-4 relative z-10">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">

          <img 
            src={logo}
            alt="Kn1ghts logo"
            className="
              w-28 h-28 
              sm:w-32 sm:h-32 
              md:w-40 md:h-40
              lg:w-64 lg:h-64
              select-none
              md:mb-16
              lg:mb-24
            "
          />

          <h1 className="
            font-title
            text-5xl 
            sm:text-6xl 
            md:text-7xl 
            lg:text-[7rem]
            font-extrabold
            text-neon
            text-center sm:text-left
          ">
            Kn1ghts.
          </h1>
        </div>

        <div className="mt-6 h-px w-48 sm:w-64 bg-neon/60 shadow-neon" />
      </header>

      {/* Cards */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-wrap justify-center gap-5 sm:gap-7">
          {team.map((member, i) => ( 
            <div key={i} className="w-full sm:w-[calc(50%-1.75rem)] lg:w-[calc(33.333%-1.75rem)]">
              <MemberCard {...member} /> 
            </div>
          ))} 
        </div>
      </main>


      {/* Footer */}
      <footer className="text-center text-xl text-neon/60 py-4 mt-20 relative z-10">
        © kn1ghts — {year}
      </footer>

    </div>
  )
}

export default App
