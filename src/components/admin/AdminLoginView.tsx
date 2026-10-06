import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { isFirebaseConfigured } from '../../services/firebaseAuth';
import { Leaf, Lock, Mail, ArrowLeft, ShieldCheck, AlertCircle, Info, Eye, EyeOff } from 'lucide-react';

export const AdminLoginView: React.FC = () => {
  const { loginAdminAsync, navigate } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const firebaseReady = isFirebaseConfigured();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Vul zowel een e-mailadres als wachtwoord in.');
      return;
    }

    try {
      setLoading(true);
      await loginAdminAsync(email, password);
      // Navigation to /admin/dashboard is handled in StoreContext upon success
    } catch (err: any) {
      setErrorMessage(err.message || 'Inloggen mislukt. Controleer je gegevens.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between text-[#243323] px-4 py-8">
      {/* Top back navigation */}
      <div className="max-w-md w-full mx-auto">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4A5D3E] hover:text-[#1E2E1D] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Terug naar de website</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white border border-[#E3DBD0] rounded-2xl p-7 sm:p-9 shadow-sm space-y-6">
          {/* Brand & Title */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#4A5D3E] text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Leaf className="w-6 h-6 text-[#F4EFEA]" />
            </div>

            <div className="space-y-1 pt-1">
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#1E2E1D]">
                Beheer 't Vosjeskruid
              </h1>
              <p className="text-xs text-[#5D6D5A] leading-relaxed max-w-xs mx-auto">
                Log in om de website en inhoud van 't Vosjeskruid te beheren.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-[#FDF2F2] border border-[#F3CECE] text-[#8E2A2B] rounded-xl p-3.5 flex items-start gap-2.5 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block font-medium text-[#2C3D29]">
                E-mailadres
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="beheerder@vosjeskruid.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1E2E1D] placeholder:text-[#999] focus:outline-none focus:ring-1 focus:ring-[#4A5D3E] focus:bg-white transition-all disabled:opacity-60"
                />
                <Mail className="w-4 h-4 text-[#7A8A77] absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block font-medium text-[#2C3D29]">
                Wachtwoord
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDBD] rounded-lg pl-9 pr-10 py-2.5 text-xs sm:text-sm text-[#1E2E1D] placeholder:text-[#999] focus:outline-none focus:ring-1 focus:ring-[#4A5D3E] focus:bg-white transition-all disabled:opacity-60"
                />
                <Lock className="w-4 h-4 text-[#7A8A77] absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-0.5 text-[#7A8A77] hover:text-[#1E2E1D] cursor-pointer"
                  aria-label={showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4A5D3E] hover:bg-[#3D4D33] active:bg-[#33422A] disabled:bg-[#A3B39E] text-white font-medium text-xs sm:text-sm rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span>Inloggen verifiëren...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Inloggen</span>
                </>
              )}
            </button>
          </form>

          {/* Security & Firebase Status Indicator */}
          <div className="pt-2 border-t border-[#EFE8DD] space-y-3">
            {firebaseReady ? (
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#33562A] bg-[#EFF6EE] py-2 px-3 rounded-lg border border-[#D0E5CE]">
                <ShieldCheck className="w-4 h-4" />
                <span>Beveiligd met Firebase Authentication</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#7A643A] bg-[#F7F3EB] py-2 px-3 rounded-lg border border-[#E7DDCD]">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>Firebase Auth status</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSetupGuide(!showSetupGuide)}
                    className="font-semibold underline hover:text-[#4A5D3E] cursor-pointer text-[10px]"
                  >
                    {showSetupGuide ? 'Verberg uitleg' : 'Bekijk configuratie'}
                  </button>
                </div>

                {showSetupGuide && (
                  <div className="bg-[#FAF8F5] border border-[#DDD3C3] rounded-xl p-3.5 text-[11px] text-[#4A5947] space-y-2 animate-in fade-in duration-200">
                    <p className="font-semibold text-[#1E2E1D]">
                      Hoe koppel je jouw Firebase-project?
                    </p>
                    <p className="leading-relaxed">
                      Voeg in Vercel onder <strong>Project Settings &gt; Environment Variables</strong> (of lokaal in <code>.env.local</code>) de volgende variabelen toe:
                    </p>
                    <ul className="space-y-1 font-mono text-[10px] text-[#293B27] bg-white p-2 rounded border border-[#E2DACB]">
                      <li>VITE_FIREBASE_API_KEY</li>
                      <li>VITE_FIREBASE_AUTH_DOMAIN</li>
                      <li>VITE_FIREBASE_PROJECT_ID</li>
                    </ul>
                    <p className="leading-relaxed text-[10px] text-[#637361]">
                      Hiermee log je straks rechtstreeks in met jouw eigen beheerdersaccount in Firebase Authentication.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="max-w-md w-full mx-auto text-center text-[11px] text-[#8C9886]">
        <p>© {new Date().getFullYear()} 't Vosjeskruid · Beveiligde Beheeromgeving</p>
      </div>
    </div>
  );
};
