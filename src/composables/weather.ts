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
        }
        return 'fog'
    }
}