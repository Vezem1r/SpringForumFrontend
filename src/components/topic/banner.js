import React from 'react';

const Banner = ({ bannerUrl }) => {
    if (!bannerUrl) return null;

    return (
        <div className="relative h-80 w-full overflow-hidden mb-4 rounded-lg shadow-lg">
            <img
                src={bannerUrl}
                alt="Banner"
                className="object-cover w-full h-full transition-transform duration-500 ease-in-out transform hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent flex items-center justify-center">
            </div>
        </div>
    );
};

export default Banner;
