import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { GraduationCap, LogIn } from "lucide-react";

const AdminLogin: React.FC = () => {
  const { t } = useLanguage();
  const { adminLogin, adminRegister, isAdmin } = useData();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (isAdmin) navigate("/admin");
  }, [isAdmin, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isRegister) {
      const ok = adminRegister(email, password);
      if (!ok) {
        setError("Email already exists or registration failed.");
        return;
      }
      const users = JSON.parse(localStorage.getItem("eduport_users") || "[]");
      if (users.length === 1) {
        navigate("/admin");
      } else {
        setError(t.admin.notAdmin);
      }
    } else {
      const ok = adminLogin(email, password);
      if (!ok) {
        setError("Invalid credentials or not an admin.");
        return;
      }
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-heading font-bold text-3xl">{isRegister ? t.admin.register : t.admin.login}</h1>
          <p className="text-sm text-muted-foreground mt-2">{t.admin.firstUserNote}</p>
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
              className="w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {isRegister ? t.admin.registerBtn : t.admin.loginBtn}
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
