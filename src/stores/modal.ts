import {defineStore} from "pinia";
import {ref} from "vue";

export const useModalStore = defineStore('modal', () => {
    const isAllowAppDownloadModal = ref((localStorage?.getItem('isAllowAppDownloadModal') ?? 'true') === 'true');
    const isShowAppDownloadModal = ref(false);

    const setIsAllowAppDownloadModal = (val: boolean) => {
        localStorage.setItem('isAllowAppDownloadModal', String(val));
        isAllowAppDownloadModal.value = val;
    }

    return {
        isAllowAppDownloadModal,
        isShowAppDownloadModal,
        setIsAllowAppDownloadModal
    }
});
