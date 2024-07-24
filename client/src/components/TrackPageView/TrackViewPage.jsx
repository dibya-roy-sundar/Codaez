import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from '../../analytics.js';

const TrackPageView = () => {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname + location.search);
    }, [location]);

    return null;
};

export default TrackPageView;  