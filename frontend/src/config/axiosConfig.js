import useLoadingStore from "@/store/useLoadingStore";
import axios from "axios";



// Add a request interceptor
axios.interceptors.request.use(
    (config) => {
        // Set loading to true before the request is sent
        const setLoading = useLoadingStore.getState().setLoading;
        setLoading(true);
        return config;
    },
    (error) => {
        // Set loading to false if the request fails
        const setLoading = useLoadingStore.getState().setLoading;
        setLoading(false);
        return Promise.reject(error);
    }
);

// Add a response interceptor
axios.interceptors.response.use(
    (response) => {
        // Set loading to false after the response is received
        const setLoading = useLoadingStore.getState().setLoading;
        setLoading(false);
        return response;
    },
    (error) => {
        // Set loading to false if an error occurs
        const setLoading = useLoadingStore.getState().setLoading;
        setLoading(false);
        return Promise.reject(error);
    }
);

export default axios;
