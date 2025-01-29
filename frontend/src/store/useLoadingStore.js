
// create a persistent store
import { create } from "zustand";

const useLoadingStore = create((set) => ({
    loading:false,
    setLoading:(status)=>{
        set({loading:status});
    }
}))




export default useLoadingStore;