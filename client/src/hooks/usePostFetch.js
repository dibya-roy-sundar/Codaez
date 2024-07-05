import { makeRequest } from "./makeRequest";

const usePostFetch = async (url, bodyData,makeCall = true) => {
    try {
        if (!makeCall) {
            return {  };
        }
        const resp = await makeRequest.post(url, { ...bodyData }, {
            withCredentials: true
        })
        // console.log(resp)
        if (resp.data) {
            return { data: resp.data };
        }
        else {
            return { error: resp.error };
        }
    }
    catch (err) {
        console.log(err);
        return {
            success: false,
            status: err.response.status,
            error: `${err.response.data.error}`
        }
    }
}

export default usePostFetch;