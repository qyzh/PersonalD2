import Link from 'next/link';
import React from 'react';
const dir_diare = 'https://dir-diare.vercel.app/';
const Footer: React.FC = () => {
    return (
        <footer className='font-mono font-light text-white text-left p-4'>
            <p>This project is for personal use and educational purposes only. &copy; 2025
                <Link href={dir_diare}
                target="_blank"
                className='text-blue-400 ml-2 font-semibold hover:underline animate-pulse'>
                 dir-diare</Link>. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
