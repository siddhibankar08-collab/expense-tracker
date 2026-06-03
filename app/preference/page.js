

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-6">
      <div className="w-full max-w-5xl">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1B2F6B] mb-4">
            How will you use SpendWise?
          </h1>

          <p className="text-gray-500 text-lg">
            Select the option that best matches your needs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Use */}
          <button
            type="button"
            className="
              group
              bg-white
              border border-gray-200
              p-8
              rounded-3xl
              shadow-lg
              text-left
              transition-all
              duration-300
              hover:bg-[#1B2F6B]
              hover:text-white
              hover:scale-[1.03]
              cursor-pointer
            "
          >
            <div
              className="
                w-20 h-20
                rounded-2xl
                bg-[#1B2F6B]/10
                flex items-center justify-center
                text-5xl
                mb-6
                transition-all
                duration-300
                group-hover:bg-white/20
              "
            >
              👤
            </div>

            <h2 className="text-3xl font-bold text-[#1B2F6B] group-hover:text-white mb-3">
              Personal Use
            </h2>

            <p className="text-gray-600 group-hover:text-blue-100 leading-relaxed">
              Track daily expenses, manage budgets, monitor spending habits,
              and gain insights into your personal finances.
            </p>
          </button>

          {/* Business Tracking */}
          <button
            type="button"
            className="
              group
              bg-white
              border border-gray-200
              p-8
              rounded-3xl
              shadow-lg
              text-left
              transition-all
              duration-300
              hover:bg-[#1B2F6B]
              hover:text-white
              hover:scale-[1.03]
              cursor-pointer
            "
          >
            <div
              className="
                w-20 h-20
                rounded-2xl
                bg-[#1B2F6B]/10
                flex items-center justify-center
                text-5xl
                mb-6
                transition-all
                duration-300
                group-hover:bg-white/20
              "
            >
              🏪
            </div>

            <h2 className="text-3xl font-bold text-[#1B2F6B] group-hover:text-white mb-3">
              Business Tracking
            </h2>

            <p className="text-gray-600 group-hover:text-blue-100 leading-relaxed">
              Manage shop finances, monitor revenue and expenses, and generate
              detailed reports for better business decisions.
            </p>
          </button>
        </div>

        {/* Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic">
            * This is an important step to create your dashboard accordingly.
          </p>
        </div>
      </div>
    </div>
  );
}