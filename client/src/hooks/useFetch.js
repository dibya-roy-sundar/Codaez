import { useEffect, useState } from "react"
import { makeRequest } from "./makeRequest";

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await makeRequest.get(url, {
                    withCredentials: true,
                })
                setData(data.data);
            }
            catch (e) {
                console.log(e);
                setError(true);
            }
            setLoading(false);
        }
        fetchData();
    }, [url])

    return { data, loading, error };
}

export default useFetch;