import React from 'react';
import { supabase } from '../services/supabaseClient';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared-tailwind';
import { LogoIcon } from './icons';

const Auth: React.FC = () => {
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
       <div className="flex flex-col items-center justify-center mb-6">
        <LogoIcon className="w-12 h-12 text-indigo-600 mb-3" />
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight text-center">
            Welcome to Roopix<span className="text-indigo-600"> AI</span>
        </h1>
        <p className="text-slate-500 mt-1 text-center">Sign in or create an account to continue</p>
      </div>
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google', 'github']}
        theme="light"
        socialLayout="horizontal"
      />
    </div>
  );
};

export default Auth;