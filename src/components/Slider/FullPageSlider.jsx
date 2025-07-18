// import React, { useEffect, useState } from 'react';

// const images = [
//   '/photo2.jpg', 
//   '/photo5.jpg', 
//   '/photo4.jpg' 
// ];

// const FullPageSlider = () => {
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     const slideTimer = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % images.length);
//     }, 3000);
//     return () => clearInterval(slideTimer);
//   }, []);

//   return (
//     <div className="relative w-full h-screen overflow-hidden bg-white-500">
//       {images.map((img, index) => {
//         const isActive = index === current;
//         const isFullScreen = index === 0;

//         return (
//           <div
//             key={index}
//             className={`absolute flex justify-center items-center top-0 left-0 w-full h-full transition-opacity duration-1000 ${
//               isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
//             }`}
//           >
//             <div
//               className={`bg-center bg-cover rounded-lg shadow-lg ${
//                 isFullScreen ? 'w-full h-full' : 'w-[80%] h-[80%]'
//               }`}
//               style={{ backgroundImage: `url(${img})` }}
//             />
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default FullPageSlider;


import React, { useEffect, useState } from 'react';

const mobileImages = ['https://img.pikbest.com/templates/20240603/best-offer-sales-upto-50-25-discount-poster_10595616.jpg!sw800', 
  'https://img.freepik.com/premium-photo/shopping-cart-is-being-loaded-with-apples-blue-cell-phone_929888-166.jpg', 
  'https://img.freepik.com/free-vector/modern-buy-one-get-one-free-banner_1017-28232.jpg'];

const desktopImages = ['/photo2.jpg', '/photo5.jpg', '/photo4.jpg'];

const FullPageSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check screen width on mount and resize
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imagesToShow.length);
    }, 2000);
    return () => clearInterval(slideTimer);
  }, [isMobile]);

  const imagesToShow = isMobile ? mobileImages : desktopImages;

  return (
  <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* Slide Images */}
      {imagesToShow.map((img, index) => {
        const isActive = index === current;

        return (
          <div
            key={index}
            className={`absolute flex justify-center items-center top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div
              className={`bg-center bg-cover rounded-lg shadow-lg ${
                isMobile ? 'w-[80%] h-[70%]' : 'w-full h-full'
              }`}
              style={{ backgroundImage: `url(${img})` }}
            />
          </div>
        );
      })}

      {/* Dots Navigation */}
      <div className="absolute bottom-5 w-full flex justify-center space-x-3 z-20">
        {imagesToShow.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index ? 'bg-black scale-125' : 'bg-gray-400'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default FullPageSlider;
