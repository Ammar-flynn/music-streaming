import { Loader2 } from "lucide-react";

interface AuthModalProps {
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;
  registerUsername: string;
  setRegisterUsername: (username: string) => void;
  registerEmail: string;
  setRegisterEmail: (email: string) => void;
  registerPassword: string;
  setRegisterPassword: (password: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
  showOtpInput: boolean;
  error: string;
  isLoading: boolean;
  onLogin: (e: React.FormEvent) => void;
  onRegister: (e: React.FormEvent) => void;
  onVerifyOtp: (e: React.FormEvent) => void;
  onResendOtp: () => void;
  onGuestContinue: () => void;
}

export function AuthModal({ 
  mode, 
  onModeChange,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  registerUsername,
  setRegisterUsername,
  registerEmail,
  setRegisterEmail,
  registerPassword,
  setRegisterPassword,
  otp,
  setOtp,
  showOtpInput,
  error,
  isLoading,
  onLogin,
  onRegister,
  onVerifyOtp,
  onResendOtp,
  onGuestContinue
}: AuthModalProps) {
  
  // Show OTP verification UI
  if (showOtpInput) {
    return (
      <div className="auth-container">
        <div className="auth-card frozen-card">
          <h2>Verify Your Email</h2>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
            Please enter the 6-digit OTP sent to your email
          </p>
          {error && (
            <div className="auth-error" style={{ 
              background: error.includes("sent") ? '#e8f5e9' : '#fee2e2',
              color: error.includes("sent") ? '#2e7d32' : '#dc2626'
            }}>
              {error}
            </div>
          )}
          <form onSubmit={onVerifyOtp}>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
              style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '4px' }}
            />
            <button type="submit" className="play-button" disabled={isLoading}>
              {isLoading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : "Verify OTP"}
            </button>
          </form>
          <button 
            onClick={onResendOtp} 
            className="guest-button" 
            style={{ marginTop: '12px' }}
            disabled={isLoading}
          >
            Resend OTP
          </button>
          <button 
            onClick={() => {
              setOtp("");
              onModeChange("register");
            }} 
            className="guest-button" 
            style={{ marginTop: '8px' }}
          >
            Back to Registration
          </button>
        </div>
      </div>
    );
  }

  // Show login/register UI
  return (
    <div className="auth-container">
      <div className="auth-card frozen-card">
        <h2>{mode === "login" ? "Login to Frozen Beats" : "Create Account"}</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={mode === "login" ? onLogin : onRegister}>
          {mode === "register" && (
            <input 
              type="text" 
              placeholder="Username" 
              value={registerUsername} 
              onChange={(e) => setRegisterUsername(e.target.value)} 
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            value={mode === "login" ? loginEmail : registerEmail} 
            onChange={(e) => mode === "login" ? setLoginEmail(e.target.value) : setRegisterEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={mode === "login" ? loginPassword : registerPassword} 
            onChange={(e) => mode === "login" ? setLoginPassword(e.target.value) : setRegisterPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="play-button" disabled={isLoading}>
            {isLoading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : (mode === "login" ? "Login" : "Register")}
          </button>
        </form>
        <p className="auth-switch">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { 
            onModeChange(mode === "login" ? "register" : "login");
            setOtp("");
          }}>
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
        <button onClick={onGuestContinue} className="guest-button">Continue as Guest</button>
      </div>
    </div>
  );
}