import React from 'react';
import { LogoIcon } from './icons';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-white border-t border-slate-200">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <LogoIcon className="w-7 h-7 text-indigo-600 mr-2" />
                        <span className="text-xl font-bold text-slate-800">Roopix<span className="text-indigo-600"> AI</span></span>
                    </div>
                    <div className="text-sm text-slate-500 text-center md:text-right">
                        <p>&copy; {new Date().getFullYear()} Roopix AI. All rights reserved.</p>
                        <p className="mt-1">Your Personal AI-Powered Fashion Stylist</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;