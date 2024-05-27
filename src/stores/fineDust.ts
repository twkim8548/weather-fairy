import {defineStore} from "pinia";
import {ref} from "vue";
import {useApi} from "../composables/api.ts";
import dayjs from "dayjs";

export const useFineDustStore = defineStore('fineDust', () => {
    const fineDust = ref();

    const getStation = (tmX:number, tmY: number) => {
        return useApi('GET', 'https://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList',
            {
                tmX: tmX,
                tmY: tmY,
                returnType: 'json',
                serviceKey: import.meta.env.VITE_WEATHER_API_KEY
            }
        )

    }

    const getFineDust = () => {
        useApi('GET', 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth',
            {
                serviceKey: import.meta.env.VITE_WEATHER_API_KEY,
                returnType: 'json',
                searchDate: dayjs().format('YYYY-MM-DD'),
            }
                // dataTerm: 'DAILY',
                // ver: 1.5
        ).then((res:any) => {
            fineDust.value = {};
            res?.data.response?.body?.items.forEach((item:any) => {
                const date = dayjs(item.informData).format('YYYYMMDD');
                if (!fineDust.value?.[date]) {
                    fineDust.value[date] = {}
                }
                if (fineDust.value?.[date]?.[item.informCode]) {
                    fineDust.value[date][item.informCode] = {}
                }
                fineDust.value[date][item.informCode] = item;
            })
        })

    }
    return {
        fineDust,
        getStation,
        getFineDust,
    }
});
