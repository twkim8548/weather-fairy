import {defineStore} from "pinia";
import {ref} from "vue";
import {useApi} from "../composables/api.ts";
import dayjs from "dayjs";

export const useWeatherStore = defineStore('weather', () => {
    const isLoading = ref(false);
    const home = ref();
    const workspace = ref();
    const startTime = ref(localStorage?.getItem("startTime") ?? "0900");
    const endTime = ref(localStorage?.getItem("endTime") ?? "1800");

    const getVilageFcstHome = (x: number, y: number) => {
        isLoading.value = true;
        const baseTimes = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];
        let baseTime = ''
        let today = dayjs();
        baseTimes.forEach(time => {
            if (parseInt(today.format('HH10')) >= parseInt(time)){
                baseTime = time;
            }
        })

        if (parseInt(today.format('HHmm')) <= 209) {
            today = today.subtract(1, 'day')
        }

        useApi('GET',
            `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`,
            {
                serviceKey: 'nvHb69KDKsiZAdqYRTUQsl+8nFQ9YT1AuxUxg21+3mR19ww/8HAahvY6Bh9x6lsFKrvjbq9sXMMpUHhtrwqdwQ==',
                dataType: 'JSON',
                numOfRows: 576,
                pageNo: 1,
                base_date: today.format('YYYYMMDD'),
                base_time: baseTime,
                nx: x,
                ny: y
            }
        ).then((res: any) => {
            home.value = {};
            res?.data?.response?.body?.items?.item?.forEach(item => {
                if (!home.value[item.fcstDate]) {
                    home.value[item.fcstDate] = {};
                }
                if (!home.value[item.fcstDate]?.[item.fcstTime]) {
                    home.value[item.fcstDate][item.fcstTime] = {};
                }
                home.value[item.fcstDate][item.fcstTime][item.category] = item.fcstValue;
            })
        }).catch((err: any) => {
            console.log(err);
        });
    }

    const getVilageFcstWorkspace = (x: number, y: number) => {
        isLoading.value = true;
        const baseTimes = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];
        let baseTime = ''
        let today = dayjs();
        baseTimes.forEach(time => {
            if (parseInt(today.format('HH10')) >= parseInt(time)){
                baseTime = time;
            }
        })

        if (parseInt(today.format('HHmm')) <= 209) {
            today = today.subtract(1, 'day')
        }

        useApi('GET',
            `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`,
            {
                serviceKey: 'nvHb69KDKsiZAdqYRTUQsl+8nFQ9YT1AuxUxg21+3mR19ww/8HAahvY6Bh9x6lsFKrvjbq9sXMMpUHhtrwqdwQ==',
                dataType: 'JSON',
                numOfRows: 576,
                pageNo: 1,
                base_date: today.format('YYYYMMDD'),
                base_time: baseTime,
                nx: x,
                ny: y
            }
        ).then((res: any) => {
            workspace.value = {};
            res?.data?.response?.body?.items?.item?.forEach(item => {
                if (!workspace.value[item.fcstDate]) {
                    workspace.value[item.fcstDate] = {};
                }
                if (!workspace.value[item.fcstDate]?.[item.fcstTime]) {
                    workspace.value[item.fcstDate][item.fcstTime] = {};
                }
                workspace.value[item.fcstDate][item.fcstTime][item.category] = item.fcstValue;
            })
        }).catch((err: any) => {
            console.log(err);
        });
    }

    const setStartTime = (time:string) => {
        localStorage.setItem("startTime", time);
        startTime.value = time;
    }

    const setEndTime = (time:string) => {
        localStorage.setItem("setEndTime", time);
        endTime.value = time;
    }

    return {
        home,
        workspace,
        getVilageFcstHome,
        getVilageFcstWorkspace,
        startTime,
        endTime,
        setStartTime,
        setEndTime,
    }
});
