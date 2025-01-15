import { useEffect, useState } from "react"
import { makeRequest } from "./makeRequest";
import { toast } from "react-toastify";

const useFetch = (url, makeCall = true, reload = 0) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!makeCall) {
                    return { data, loading, error };
                }
                setError(false);
                setLoading(true);
                const resp = await makeRequest.get(url, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('codaeztoken')}`,
                    }
                })
                setData(resp.data);
            }
            catch (e) {
                console.log(e);
                setError(true);
                if (e.response.data.error == "Json Web Token is invalid" || e.response.data.error == "Json Web Token is expired") {
                    localStorage.removeItem('codaeztoken')
                    toast.success("You have been Logged Out!", { position: "top-right" });
                }
            }
            setLoading(false);
        }
        fetchData();
    }, [url, reload])

    return { data, loading, error };
}

export default useFetch;