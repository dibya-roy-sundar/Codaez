import { makeRequest } from "./makeRequest";

const usePutHook = async (url, bodyData, options = {}) => {
    // url and bodydata always required
    // pass options only when some extra options are also to be given e.g. while uploading image, option.header is required
    try {
        const data = await makeRequest.put(url, { ...bodyData }, {
            // withCredentials: true,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            ...options
        });
        // console.log(data)
        if (data.data) {
            return { data: data.data };
        }
        else {
            return { error: data.error };
        }
    } catch (err) {
        console.log(err);
        return {
            success: false,
            status: err.response.status,
            error: `${err.response.data.error}`
        }
    }
}

export default usePutHook;