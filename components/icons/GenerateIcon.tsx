import React from 'react';

export const GenerateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <>
        <svg fill="none" viewBox="0 0 24 24" stroke="url(#gradient)" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.455-2.455l-1.197-.398 1.197-.398a3.375 3.375 0 002.455-2.455l.398-1.197.398 1.197a3.375 3.375 0 002.455 2.455l1.197.398-1.197.398a3.375 3.375 0 00-2.455 2.455z" />
        </svg>
        <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgb(217, 70, 239)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgb(20, 184, 166)', stopOpacity: 1 }} />
                </linearGradient>
            </defs>
        </svg>
    </>
);
