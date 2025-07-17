import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Script from 'next/script';

// Import Chart.js configuration early
import '../utils/chartConfig';

/**
 * The main app component. This wraps the entire app with a Navbar and Footer.
 *
 * @param {{ Component: React.ComponentType, pageProps: any }} props
 *        The props passed in from Next.js.
 * @returns {JSX.Element}
 *         The app component.
 */
function MyApp({ Component, pageProps }: { Component: React.ComponentType, pageProps: any }): JSX.Element {
    return (
        <>
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy="beforeInteractive"
            />
            <Navbar />
            <Component {...pageProps} />
            <Footer />
        </>
    );
}

export default MyApp;
