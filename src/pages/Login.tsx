import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (email === 'admin@gmail.com' && password === 'admin@123') {
        login();
        toast.success("Welcome back, Admin!");
        navigate('/');
      } else {
        toast.error("Invalid credentials. Please try again.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 p-12 flex-col justify-between relative overflow-hidden">

        {/* Abstract shapes for visual interest */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-2xl">🤝</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Talent Matcher</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Match Top Talent <br /> <span className="text-accent/90">Instantly.</span>
          </h1>
          <p className="text-lg text-white/80 leading-relaxed font-light">
            Streamline your recruitment process with intelligent candidate ranking, skill matching, and automated workflows designed for modern HR teams.
          </p>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 group">
            <div className="h-12 w-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <div>
              <p className="text-white font-semibold">Fast Processing</p>
              <span className="text-white/60 text-sm">Analyze resumes in seconds</span>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="h-12 w-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">🎯</span>
            </div>
            <div>
              <p className="text-white font-semibold">Precision Matching</p>
              <span className="text-white/60 text-sm">AI-driven candidate scoring</span>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="h-12 w-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">📉</span>
            </div>
            <div>
              <p className="text-white font-semibold">Cost Efficiency</p>
              <span className="text-white/60 text-sm">Significantly reduce time-to-hire</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/40 text-sm">
          © 2024 Talent Matcher. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">

          <div className="lg:hidden mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-4xl">🤝</span>
            </div>
            <span className="text-2xl font-bold text-primary">Talent Matcher</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-2">
              Please enter your credentials to access the admin portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gmail.com"
                  required
                  className="pl-10 h-11 bg-muted/30 border-input hover:border-accent/50 focus:border-accent transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-xs text-primary hover:text-primary/80 font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="admin@123"
                  required
                  className="pl-10 pr-10 h-11 bg-muted/30 border-input hover:border-accent/50 focus:border-accent transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Checkbox id="remember" />
              <Label
                htmlFor="remember"
                className="text-sm font-normal text-muted-foreground cursor-pointer select-none"
              >
                Keep me signed in for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : 'Sign in to Dashboard'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
