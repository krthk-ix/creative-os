import { useState } from 'react';
import Login from './auth/Login';
import Signup from './auth/Signup';

export default function Auth() {
  const [showLogin, setShowLogin] = useState(true);

  return showLogin ? (
    <Login onSwitchToSignup={() => setShowLogin(false)} />
  ) : (
    <Signup onSwitchToLogin={() => setShowLogin(true)} />
  );
}
