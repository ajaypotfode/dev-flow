import axios, { AxiosError, AxiosRequestConfig } from "axios";

const apiClient = axios.create({
    withCredentials: true
});

// let failedQueue: Array<{
//     resolve: (value?: any) => void,
//     reject: (reason: any) => void
// }> = [];

// const processQueue = (error: unknown) => {
//     failedQueue.forEach(prom => {
//         if (error) {
//             prom.reject(error)
//         } else {
//             prom.resolve()
//         }
//     });

//     failedQueue = []
// }

// let isRefreshing = false;



apiClient.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // console.log("error   :", error);

        // const originalrequest = error.config as AxiosRequestConfig & { _retry: boolean };

        // if (error.response?.status === 401 && !originalrequest._retry) {
        //     if (isRefreshing) {
        //         return new Promise((resolve, reject) => {
        //             failedQueue.push({
        //                 resolve,
        //                 reject
        //             })
        //         }).then(() => apiClient(originalrequest/* retry it again when promise get resolve*/))
        //             .catch((error) => Promise.reject(error))
        //     }

        //     isRefreshing = true;
        //     originalrequest._retry = true;

        //     try {
        //         await axios.post(
        //             `http://localhost:3000/api/auth/refresh-token`,
        //             {},
        //             { withCredentials: true }
        //         )

        //         processQueue(null);
        //         return apiClient(originalrequest)
        //     } catch (error) {
        //         processQueue(error);

        //         if (typeof window !== 'undefined') {
        //             window.location.href = '/auth/login'
        //         }

        //         return Promise.reject(error)
        //     }
        //     finally {
        //         isRefreshing = false
        //     }

        // }

        return Promise.reject(error)

    }
)

export default apiClient