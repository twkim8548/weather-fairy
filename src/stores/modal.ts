import {defineStore} from "pinia";
import {ref} from "vue";

export const useModalStore = defineStore('modal', () => {
    const isShowAppDownloadModal = ref((localStorage?.getItem('isAllowAppDownloadModal') ?? 'false') === 'true');

    const setIsShowAppDownloadModal = (val: boolean) => {
        localStorage.setItem('isAllowAppDownloadModal', String(val));
        isShowAppDownloadModal.value = val;
    }

    return {
        isShowAppDownloadModal,
        setIsShowAppDownloadModal
    }
});
