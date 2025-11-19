import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, Check, X } from 'lucide-react';
import { passwordRequirements, validatePassword, getPasswordStrength } from '../../utils/passwordValidation';
import TermsModal from './TermsModal';

interface SignupProps {
  onSwitchToLogin: () => void;
}

export default function Signup({ onSwitchToLogin }: SignupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();

  const passwordValidation = validatePassword(password);
  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordValidation.isValid) {
      setError('Password does not meet all requirements');
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms and Conditions');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);
      if (error) throw error;
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!agreedToTerms) {
      setError('You must agree to the Terms and Conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleTermsClick = () => {
    setShowTerms(true);
  };

  const handleTermsScrollComplete = () => {
    setHasReadTerms(true);
  };

  const handleTermsClose = () => {
    setShowTerms(false);
  };

  const handleTermsCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && !hasReadTerms) {
      setShowTerms(true);
      e.preventDefault();
      return;
    }
    setAgreedToTerms(e.target.checked);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <img src="/shootx logo.png" alt="ShootX" className="h-8 mb-6" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Create your account
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get started with ShootX today
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            className="w-full mb-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
              <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-black text-gray-500 dark:text-gray-400">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white"
                  placeholder="Create a strong password"
                />
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              <div className="mt-2 space-y-1.5">
                {passwordRequirements.map((req, index) => {
                  const isValid = req.test(password);
                  return (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      {isValid ? (
                        <Check size={14} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <X size={14} className="text-gray-400 dark:text-gray-600 flex-shrink-0" />
                      )}
                      <span className={isValid ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}>
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={handleTermsCheckboxChange}
                className="mt-0.5 w-4 h-4 text-gray-900 bg-gray-100 border-gray-300 rounded focus:ring-gray-900 dark:focus:ring-white dark:ring-offset-gray-900 focus:ring-2 dark:bg-gray-800 dark:border-gray-700"
              />
              <label htmlFor="terms" className="text-xs text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={handleTermsClick}
                  className="text-gray-900 dark:text-white font-medium hover:underline"
                >
                  Terms and Conditions
                </button>
                {hasReadTerms && <span className="ml-1 text-green-600 dark:text-green-400">✓ Read</span>}
              </label>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !passwordValidation.isValid || !agreedToTerms}
              className="w-full bg-gray-900 dark:bg-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black font-medium py-2.5 px-4 rounded-lg transition-opacity text-sm flex items-center justify-center gap-2"
            >
              <UserPlus size={16} />
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-gray-900 dark:text-white font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gray-50 dark:bg-gray-950 items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Join thousands of creators
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Transform your product visuals with AI-powered workflows for photography, models, backgrounds, and more.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-1.5 h-1.5 bg-brand rounded-full mt-1.5 flex-shrink-0"></span>
              <span>Generate human models and lifestyle shots</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-1.5 h-1.5 bg-brand rounded-full mt-1.5 flex-shrink-0"></span>
              <span>Create professional product backgrounds</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-1.5 h-1.5 bg-brand rounded-full mt-1.5 flex-shrink-0"></span>
              <span>Virtual try-on and color variations</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Terms Modal */}
      <TermsModal
        isOpen={showTerms}
        onClose={handleTermsClose}
        onScrollComplete={handleTermsScrollComplete}
      />
    </div>
  );
}
