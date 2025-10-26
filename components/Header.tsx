import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 pb-2">
                LogoMotion
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
                Create, edit, and brainstorm your perfect logo with AI.
            </p>
        </header>
    );
};

export default Header;