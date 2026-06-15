import { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<'Admin' | 'Staff' | 'Student'>('Admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoggingIn(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoggingIn(false);
      if (role !== 'Admin') {
        setError(`Access Denied: Only Administrators can access the ERP backend portal. As a ${role}, please use the mobile app.`);
      } else {
        // Any admin credentials work for now
        onLogin();
      }
    }, 800);
  };

  return (
    <div className="flex h-screen w-full bg-surface overflow-hidden">
      
      {/* Left Half: School Image & Branding */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-center items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center animate-[scaleIn_20s_ease-out_forwards]"
          style={{ backgroundImage: `url('/indian_school_building.png')` }}
        />
        
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A192F]/80 via-[#1e3a8a]/70 to-transparent" />
        
        {/* Branding Content */}
        <div className="relative z-10 flex flex-col items-center text-white px-12 text-center animate-[slideUp_0.8s_ease-out]">
          <div className="mb-6 w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
            <span className="material-symbols-outlined text-[48px] text-white">school</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 font-[Outfit] whitespace-nowrap">
            Elevation <span className="text-blue-300">ERP</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-[450px] leading-relaxed font-medium">
            Empowering modern Indian schools with intelligent administration, seamless communication, and data-driven insights.
          </p>
        </div>
      </div>

      {/* Right Half: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 animate-[fadeIn_0.5s_ease-out]">
        <div className="w-full max-w-[450px] min-w-[320px] bg-surface rounded-3xl border border-outline-variant card-shadow p-8 sm:p-10 relative overflow-hidden">
          
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-on-surface mb-2 tracking-tight whitespace-nowrap">Welcome Back</h2>
            <p className="text-sm text-on-surface-variant font-medium">Please sign in to access your portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection Tabs */}
            <div className="bg-surface-container-lowest p-1.5 rounded-xl border border-outline-variant flex gap-1 mb-6">
              {(['Admin', 'Staff', 'Student'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
                    role === r 
                      ? 'bg-primary text-on-primary shadow-sm scale-[1.02]' 
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {error && (
              <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-bold flex gap-3 items-start animate-[slideUp_0.3s_ease-out]">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <p className="leading-snug">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  {role === 'Student' ? 'Admission Number' : 'Username or Email'}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    {role === 'Student' ? 'badge' : 'person'}
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={role === 'Student' ? "e.g. ADM-2023-001" : "e.g. admin@school.com"}
                    className="w-full bg-surface border border-outline-variant rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Password
                  </label>
                  <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    lock
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface border border-outline-variant rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#2563EB] hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <>
                  Secure Login
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-outline-variant/50 pt-6">
            <p className="text-xs text-on-surface-variant font-medium">
              Powered by <span className="font-bold text-on-surface">Stitch MCP</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
