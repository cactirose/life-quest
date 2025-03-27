<Card className="w-[380px] bg-[var(--rpg-parchment)] border-[#3f210e]">
  <CardContent className="p-6">
    <h2 className="text-[#3f210e] font-pixel text-2xl mb-4">Login</h2>
    <p className="text-[#3f210e] text-sm mb-6">Enter your credentials to continue your quest</p>
    
    <form className="space-y-4">
      <div className="space-y-2">
        <label className="text-[#3f210e] text-sm">Email</label>
        <input 
          className="w-full px-3 py-2 bg-white/90 border border-[#3f210e] rounded-md text-[#3f210e]" 
          type="email"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-[#3f210e] text-sm">Password</label>
        <input 
          className="w-full px-3 py-2 bg-white/90 border border-[#3f210e] rounded-md text-[#3f210e]" 
          type="password"
        />
      </div>

      <div className="flex justify-end">
        <a className="text-[#3f210e] text-sm hover:opacity-80" href="#">
          Forgot password?
        </a>
      </div>

      <button 
        className="w-full bg-[#D2B48C] text-[#3f210e] hover:bg-[#3f210e] hover:text-[#D2B48C] 
                   py-2 rounded-md font-medium transition-colors duration-200 border border-[#3f210e]"
      >
        Login
      </button>

      <div className="text-center space-y-2">
        <p className="text-[#3f210e] text-sm">
          Don't have an account?{" "}
          <a className="text-[#3f210e] hover:opacity-80 underline" href="#">
            Sign up
          </a>
        </p>
        <a className="text-[#3f210e] text-sm hover:opacity-80" href="#">
          Continue as Guest
        </a>
      </div>
    </form>
  </CardContent>
</Card> 