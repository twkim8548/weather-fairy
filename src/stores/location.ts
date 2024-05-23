import {defineStore} from "pinia";
import {ref} from "vue";
import {useApi} from "../composables/api.ts";

export const useLocationStore = defineStore('location', () => {
    const homeAddress = ref(localStorage.getItem("homeAddress"));
    const homePosition = ref({lat:localStorage.getItem("homePositionLat"), lng:localStorage.getItem("homePositionLng")});
    const workspaceAddress = ref(localStorage.getItem("workspaceAddress"));
    const workspacePosition = ref({lat:localStorage.getItem("workspacePositionLat"), lng:localStorage.getItem("workspacePositionLng")});

    const getAddressToLocation = (address: string) => {
        return useApi('GET', 'https://dapi.kakao.com/v2/local/search/address.json',
            {
              "query": address
            },
            null,
            {
              'Authorization': `KakaoAK a279fdf97bbc18b3ff53bb20d577bf63`
            }
        )
    }

    const setHome = (address: string, position: any) => {
        localStorage.setItem("homeAddress", address);
        localStorage.setItem("homePositionLat", position.lat);
        localStorage.setItem("homePositionLng", position.lng);
        homeAddress.value = address;
        homePosition.value = position;
    }

    const setWorkspace = (address: string, position: any) => {
        localStorage.setItem("workspaceAddress", address);
        localStorage.setItem("workspacePositionLat", position.lat);
        localStorage.setItem("workspacePositionLng", position.lng);
        workspaceAddress.value = address;
        workspacePosition.value = position;
    }
    return {
        homeAddress,
        homePosition,
        workspaceAddress,
        workspacePosition,
        getAddressToLocation,
        setHome,
        setWorkspace,
    }
});
