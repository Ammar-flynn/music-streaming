import { useState, useEffect } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Registration state
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  
  // OTP state
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [tempUserData, setTempUserData] = useState<any>(null);
  
  const [authError, setAuthError] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);

  // Register with OTP
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: registerUsername, 
          email: registerEmail, 
          password: registerPassword 
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setAuthError(data.error || 'Registration failed');
        setIsLoading(false);
        return false;
      }
      
      // Store temp data and show OTP input
      setTempUserData({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword
      });
      setShowOtpInput(true);
      setAuthError("OTP sent to your email! Please check your inbox.");
      setIsLoading(false);
      return true;
      
    } catch (err) {
      setAuthError('Registration failed. Please try again.');
      console.error(err);
      setIsLoading(false);
      return false;
    }
  };

  
  // Verify OTP
const handleVerifyOtp = async (e: React.FormEvent) => {
  e.preventDefault();
  setAuthError("");
  setIsLoading(true);
  
  try {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: tempUserData?.email, 
        otp: otp 
      })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      setAuthError(data.error || 'Invalid OTP');
      setIsLoading(false);
      return false;
    }
    
    // OTP verified successfully - now login the user
    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: tempUserData?.email, 
        password: tempUserData?.password 
      })
    });
    
    const loginData = await loginRes.json();
    
    if (!loginRes.ok) {
      setAuthError('Account created but login failed. Please try logging in.');
      setIsLoading(false);
      return false;
    }
    
    const token = loginData.token;
    localStorage.setItem('token', token);
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    setUser({ 
      userId: payload.userId, 
      role: payload.role,
      username: payload.username
    });
    
    setIsLoggedIn(true);
    setShowOtpInput(false);
    setOtp("");
    setTempUserData(null);
    setIsLoading(false);
    
    
    return true;
    
  } catch (err) {
    setAuthError('OTP verification failed. Please try again.');
    console.error(err);
    setIsLoading(false);
    return false;
  }
};

  // Resend OTP
  const handleResendOtp = async () => {
    setAuthError("");
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: tempUserData?.username, 
          email: tempUserData?.email, 
          password: tempUserData?.password 
        })
      });
      
      if (res.ok) {
        setAuthError("New OTP sent to your email!");
      } else {
        setAuthError("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      setAuthError("Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setAuthError(data.error || 'Login failed');
        setIsLoading(false);
        return false;
      }
      
      const token = data.token;
      localStorage.setItem('token', token);
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      setUser({ 
        userId: payload.userId, 
        role: payload.role,
        username: payload.username
      });
      
      setIsLoggedIn(true);
      setIsLoading(false);
      return true;
      
    } catch (err) {
      setAuthError('Login failed. Please try again.');
      console.error(err);
      setIsLoading(false);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setLoginEmail("");
    setLoginPassword("");
    setRegisterUsername("");
    setRegisterEmail("");
    setRegisterPassword("");
    setOtp("");
    setShowOtpInput(false);
    setTempUserData(null);
    setAuthError("");
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && typeof token === 'string' && token.split('.').length === 3) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ 
          userId: payload.userId, 
          role: payload.role,
          username: payload.username 
        });
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Token decode error:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  return {
    isLoggedIn,
    user,
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
    setShowOtpInput,
    tempUserData,
    authError,
    authMode,
    setAuthMode,
    isLoading,
    handleLogin,
    handleRegister,
    handleVerifyOtp,
    handleResendOtp,
    handleLogout,
  };
}