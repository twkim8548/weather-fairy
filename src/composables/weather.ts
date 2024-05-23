import Cloud from '@/assets/json/Cloud.json'
import Fog from '@/assets/json/Fog.json'
import Rainy from '@/assets/json/Rainy.json'
import RainSnow from '@/assets/json/RainSnow.json'
import Snow from '@/assets/json/Snow.json'
import Sunny from '@/assets/json/Sunny.json'
import SunnyCloud from '@/assets/json/SunnyCloud.json'
import Thunder from '@/assets/json/Thunder.json'


export const useGetWeatherJson = (weather:string) => {
    switch (weather) {
        case 'cloud': {
            return Cloud;
        }
        case 'fog':{
            return Fog;
        }
        case 'rainSnow':{
            return RainSnow;
        }
        case 'rainy':{
            return Rainy;
        }
        case 'snow':{
            return Snow;
        }
        case 'sunny':{
            return Sunny;
        }
        case 'sunnyCloud':{
            return SunnyCloud;
        }
        case 'thunder':{
            return Thunder;
        }
        default: {
            return Sunny;
        }
    }
}

export const useGetWeather = (sky: string, pty: string) => {
    if (sky === '1') {
        return 'sunny'
    } else {
        switch (pty) {
            case '1':
                return 'rainy'
            case '2':
            case '4':
                return 'rainSnow'
            case '3':
                return 'snow'
            default: {
                if (sky === '3') {
                    return 'sunnyCloud'
                } else {
                    return 'cloud'
                }
            }
        }
    }
}

export const useGetRainyText = (sky: string, pty: string) => {
    if (sky === '1') {
        return '날이 맑고'
    } else {
        switch (pty) {
            case '1':
                return '비가 내리고'
            case '2':
            case '4':
                return '눈/비가 내리고'
            case '3':
                return '눈이 내리고'
            default: {
                if (sky === '3') {
                    return '구름이 약간 있고'
                } else {
                    return '구름이 많고'
                }
            }
        }
    }
}
export const useGetWindyText = (wsd: string) => {
    if (parseFloat(wsd) <= 0) {
        return '바람이 불지 않아요'
    } else if (parseFloat(wsd) <= 1) {
        return '바람이 거의 불지 않아요'
    } else if (parseFloat(wsd) < 4) {
        return '바람이 살랑살랑 약하게 불어요'
    }  if (parseFloat(wsd) < 9) {
        return '바람이 나뭇잎이 흔들릴 정도로 약간 강하게 불어요'
    }  if (parseFloat(wsd) < 14) {
        return '바람이 나무가지가 흔들릴 정도로 강하게 불어요'
    } else {
        return '바람이 나무 전체가 흔들릴 정도로 매우 강하게 불어요'
    }
}