// const Footer = () => (
//   <div className="px-4 mx-auto md:flex md:items-center md:justify-between md:px-8">
//   <div className="flex items-center py-3 md:py-5">
//     <div className="flex items-center flex-col">
//       <img src='/logo.png' alt='Logo' title="Master Logo" width={450} height={100} className="rounded-3xl" />
//       <div className="flex justify-center mt-4">
//       <a href="https://www.youtube.com/channel/UCiYD6dTKTk0cRnhCo-3SKzw/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-600 mx-2">
//         <FaYoutube className="w-6 h-6" />
//       </a>
//       <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-600 mx-2">
//         <FaTwitter className="w-6 h-6" />
//       </a>
//       <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-600 mx-2">
//         <FaFacebook className="w-6 h-6" />
//       </a>
//       <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-600 mx-2">
//         <FaInstagram className="w-6 h-6" />
//       </a>
//     </div>

 

//   <footer style={{ padding: '20px', backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>
//     <p>© 2024 Soap2Day HD™ - All Rights Reserved</p>
//     {/* <nav>
//       <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a>
//     </nav> */}
//   </footer>
//   </div>
//   </div>
// );

// export default Footer;

import { FaYoutube, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => (
  <footer className="flex flex-col items-center justify-center px-4 py-6 mx-auto text-white bg-black">
    {/* Logo Section */}
    <img src="/logo.png" alt="Logo" title="Master Logo" width={250} height={100}  />

    {/* <div className="flex justify-center space-x-4 mb-4">
      <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-600">
        <FaYoutube className="w-6 h-6" />
      </a>
      <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-600">
        <FaTwitter className="w-6 h-6" />
      </a>
      <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-600">
        <FaFacebook className="w-6 h-6" />
      </a>
      <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-600">
        <FaInstagram className="w-6 h-6" />
      </a>
    </div> */}

    <p className="text-center">© 2024 Soap2Day HD™ - All Rights Reserved</p>
  </footer>
);

export default Footer;
