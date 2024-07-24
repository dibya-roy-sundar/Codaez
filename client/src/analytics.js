import ReactGA from 'react-ga4';

const initializeAnalytics = () => {
    ReactGA.initialize(import.meta.env.VITE_YOUR_MEASUREMENT_ID);
};

export const trackPageView = (path) => {
    // ReactGA.pageview(path);
    ReactGA.send({ hitType: "pageview", page: path, title: "Codaez Page View" });
};

export default initializeAnalytics;
