import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white p-4 shadow-lg w-full">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <Link href="/" className="text-2xl font-bold flex items-center flex-shrink-0">
          <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
          SolarEstimator
        </Link>
        <div className="flex gap-4 items-center mt-4 sm:mt-0 w-full sm:w-auto justify-end">
          <Link href="/estimate" className="bg-white text-orange-500 px-6 py-2 rounded-full hover:bg-orange-100 transition-colors duration-300 ease-in-out transform hover:scale-105 font-semibold">
            Get Estimate
          </Link>
          <Link href="/about" className="text-white hover:text-orange-100 transition-colors duration-300">
            About Us
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
