import ReactGA from 'react-ga';

const initializeAnalytics = () => {
    ReactGA.initialize(import.meta.env.VITE_YOUR_MEASUREMENT_ID);
};
export const trackPageView = (path) => {
    ReactGA.pageview(path);
};

export default initializeAnalytics;
