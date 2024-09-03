import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
            <Navbar />
            <Component {...pageProps} />
            <Footer />
        </>
    );
}

export default MyApp;
