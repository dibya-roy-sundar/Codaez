import { makeRequest } from "./makeRequest";
import Cookies from 'js-cookie';

const usePostFetch = async (url, bodyData, makeCall = true) => {
    try {
        if (!makeCall) {
            return {};
        }
        const resp = await makeRequest.post(url, { ...bodyData }, {
            withCredentials: true
        })
        if (resp.data) {
            if (resp.data.token) {
                Cookies.set('token', resp.data.token, {
                    ...resp.data.cookieOptions,
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });
            }
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