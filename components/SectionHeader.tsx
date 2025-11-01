import React from 'react';

interface SectionHeaderProps {
    title: string;
    subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">
                {title}
            </h2>
            <p className="text-slate-400 mt-2 text-lg">{subtitle}</p>
        </div>
    );
};

export default SectionHeader;
