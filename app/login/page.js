export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">

      <div className="w-full max-w-5xl flex">

        {/* Left Side */}
        <div className="w-1/2 flex flex-col justify-center px-10">

          <div className="bg-[#042A5F] w-fit px-6 py-3 rounded">
            <h1 className="text-white text-2xl font-bold">
              SpendWise
            </h1>
          </div>

        </div>

        {/* Right Side */}
        <div className="w-1/2 p-10">

          <h1 className="text-5xl font-extrabold text-[#163559] mb-8">
            Log In
          </h1>

          {/* Email */}
          <label className="block text-lg font-medium mb-2">
            Email address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-xl bg-gray-100 mb-6"
          />

          {/* Password */}
          <label className="block text-lg font-medium mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 rounded-xl bg-gray-100"
          />

          {/* Remember */}
          <div className="flex items-center mt-4">
            <input type="checkbox" />
            <span className="ml-2 text-sm">
              Remember me
            </span>
          </div>

          {/* Login Button */}
          <button className="mt-6 bg-[#163559] text-white px-10 py-2 rounded-full font-bold">
            Login
          </button>

          {/* Sign Up */}
          <p className="mt-4 text-sm">
            Don't have an account?{" "}
            <span className="font-semibold cursor-pointer">
              Sign Up
            </span>
          </p>

          {/* Forget Password */}
          <p className="mt-2 text-sm font-medium cursor-pointer">
            Forget Password?
          </p>

          {/* OR */}
          <div className="flex items-center my-8">
            <hr className="flex-grow border-black" />
            <span className="mx-4 text-sm">or</span>
            <hr className="flex-grow border-black" />
          </div>

          {/* Social Buttons */}
          <div className="space-y-4">

            <button className="w-full bg-black/20 rounded-lg py-2 text-[#163559] font-semibold">
              Continue with Google
            </button>

            <button className="w-full bg-black/20 rounded-lg py-2 text-[#163559] font-semibold">
              Continue with Facebook
            </button>

            <button className="w-full bg-black/20 rounded-lg py-2 text-[#163559] font-semibold">
              Continue with Apple
            </button>

          </div>

          <p className="mt-6 text-center text-sm">
            Sign up with your organisation?
          </p>

        </div>

      </div>

    </div>
  );
}