import {defineStore} from "pinia";
import {ref} from "vue";
import {useApi} from "../composables/api.ts";

export const useLocationStore = defineStore('location', () => {
    const homeAddress = ref(localStorage.getItem("homeAddress"));
    const homePosition = ref({
        lat: localStorage.getItem("homePositionLat"),
        lng: localStorage.getItem("homePositionLng")
    });
    const workspaceAddress = ref(localStorage.getItem("workspaceAddress"));
    const workspacePosition = ref({
        lat: localStorage.getItem("workspacePositionLat"),
        lng: localStorage.getItem("workspacePositionLng")
    });

    const getAddressToLocation = (address: string) => {
        return useApi('GET', 'https://dapi.kakao.com/v2/local/search/address.json',
            {
                "query": address
            },
            null,
            {
                'Authorization': `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`
            }
        )
    }

    const getWGS84toTM = async (lat: number, lng: number) => {
        return await useApi('GET', 'https://dapi.kakao.com/v2/local/geo/transcoord.json',
            {
                "x": lng,
                "y": lat,
                "input_coord": 'WGS84',
                "output_coord": 'TM',
            },
            null,
            {
                'Authorization': `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`
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
        getWGS84toTM,
        setHome,
        setWorkspace,
    }
});
