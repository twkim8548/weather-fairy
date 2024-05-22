import {defineStore} from "pinia";
import {ref} from "vue";
import {useApi} from "../composables/api.ts";

export const useWeatherStore = defineStore('weather', () => {
    const now = ref();

    const getVilageFcst = (x: number, y: number) => {
        useApi('GET',
            `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`,
            {
                serviceKey: 'nvHb69KDKsiZAdqYRTUQsl+8nFQ9YT1AuxUxg21+3mR19ww/8HAahvY6Bh9x6lsFKrvjbq9sXMMpUHhtrwqdwQ==',
                dataType: 'JSON',
                numOfRows: 700,
                pageNo: 1,
                base_date: '20240522',
                base_time: '1400',
                nx: x,
                ny: y
            }
        ).then((res: any) => {
            now.value = {};
            res?.data?.response?.body?.items?.item?.forEach(item => {
                if (now.value?.[item.fcstDate]?.[item.fcstTime]) {
                    now.value[item.fcstDate][item.fcstTime].push(item);
                } else {
                    if (!now.value[item.fcstDate]) {
                        now.value[item.fcstDate] = [];
                    }
                    if (!now.value[item.fcstDate]?.[item.fcstTime]) {
                        now.value[item.fcstDate][item.fcstTime] = [];
                    }
                    console.log(item);
                    now.value[item.fcstDate][item.fcstTime].push(item);
                }
            })
            console.log(now.value);
        }).catch((err: any) => {
            console.log(err);
        });
    }

    return {
        now,
        getVilageFcst,
    }
});
