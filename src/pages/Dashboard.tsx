import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ? { email: session.user.email ?? undefined } : null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { email: session.user.email ?? undefined } : null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1B2A]">
        <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#38BDF8", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1B2A] p-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-[#132236] border border-[#1E3A5F] rounded-2xl p-8 space-y-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <LogIn className="w-5 h-5 text-[#38BDF8]" />
            <h1 className="text-lg font-semibold">Dashboard Login</h1>
          </div>
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-[#0D1B2A] border-[#1E3A5F] text-white" />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-[#0D1B2A] border-[#1E3A5F] text-white" />
          <Button type="submit" disabled={submitting} className="w-full bg-[#1D6FA5] hover:bg-[#38BDF8] text-white">
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <iframe
      src="/dashboard.html"
      title="TIN Business OS Dashboard"
      onLoad={async (e) => {
        const { data: { session } } = await supabase.auth.getSession();
        const iframe = e.currentTarget as HTMLIFrameElement;
        iframe.contentWindow?.postMessage({
          type: "tin-auth",
          token: session?.access_token,
          url: import.meta.env.VITE_SUPABASE_URL,
          anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        }, "*");
      }}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
};

export default Dashboard;
