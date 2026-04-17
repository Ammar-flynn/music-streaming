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
  error: string;
  onLogin: (e: React.FormEvent) => void;
  onRegister: (e: React.FormEvent) => void;
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
  error,
  onLogin,
  onRegister,
  onGuestContinue
}: AuthModalProps) {
  return (
    <div className="auth-container">
      <div className="auth-card frozen-card">
        <h2>{mode === "login" ? "Login to Frozen Beats" : "Create Account"}</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={mode === "login" ? onLogin : onRegister}>
          {mode === "register" && (
            <input type="text" placeholder="Username" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} required />
          )}
          <input type="email" placeholder="Email" value={mode === "login" ? loginEmail : registerEmail} onChange={(e) => mode === "login" ? setLoginEmail(e.target.value) : setRegisterEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={mode === "login" ? loginPassword : registerPassword} onChange={(e) => mode === "login" ? setLoginPassword(e.target.value) : setRegisterPassword(e.target.value)} required />
          <button type="submit" className="play-button">{mode === "login" ? "Login" : "Register"}</button>
        </form>
        <p className="auth-switch">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { onModeChange(mode === "login" ? "register" : "login"); }}>
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
        <button onClick={onGuestContinue} className="guest-button">Continue as Guest</button>
      </div>
    </div>
  );
}