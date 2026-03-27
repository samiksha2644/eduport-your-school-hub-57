import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, LogIn } from "lucide-react";

const AdminLogin: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAdmin, isLoading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && user && isAdmin) navigate("/admin");
  }, [user, isAdmin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const result = await signUp(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          // After signup, try signing in
          const loginResult = await signIn(email, password);
          if (loginResult.error) {
            setError("Account created. Please check your email to verify, then log in.");
          }
        }
      } else {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-heading font-bold text-3xl">{isRegister ? t.admin.register : t.admin.login}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 border space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{t.admin.email}</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t.admin.password}</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Please wait..." : (isRegister ? t.admin.registerBtn : t.admin.loginBtn)}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            {isRegister ? t.admin.hasAccount : t.admin.noAccount}{" "}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(""); }}
              className="text-primary font-semibold hover:underline"
            >
              {isRegister ? t.admin.loginBtn : t.admin.registerBtn}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
