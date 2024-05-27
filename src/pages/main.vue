<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useWeatherStore} from "@/stores/weather.ts";
import {computed, onMounted, ref} from "vue";
import {useConvertXY} from "@/composables/grid.ts";
import {Vue3Lottie} from "vue3-lottie";
import {useGetRainyText, useGetWeather, useGetWeatherJson, useGetWindyText} from "@/composables/weather.ts";
import dayjs from "dayjs";
import LoadingJson from '@/assets/json/Loading.json'
import {useLocationStore} from "@/stores/location.ts";
import {useApi} from "@/composables/api.ts";
import {useFineDustStore} from "@/stores/fineDust.ts";

const weatherStore = useWeatherStore();
const locationStore = useLocationStore();
const fineDustStore = useFineDustStore();
const {home, workspace, startTime, endTime, moveTime} = storeToRefs(weatherStore);
const {homePosition, workspacePosition, homeAddress, workspaceAddress} = storeToRefs(locationStore);
const {fineDust} = storeToRefs(fineDustStore);

const today = dayjs();
const selectedDate = ref('today');
const selectedType = ref('leave');
const date = computed(() => selectedDate.value === 'today' ? dayjs().format('YYYYMMDD') : dayjs().add(1, 'day').format('YYYYMMDD'))
const homeDate = computed(() => {
  if (selectedType.value === 'goto') {
    return {
      day: date.value,
      time: startTime.value
    };
  } else {
    let time: number | string = parseInt(endTime.value) + parseInt(`${moveTime.value}00`);
    let day = date.value;
    if (time >= 2400) {
      day += dayjs(date.value).add(1, 'day').format('YYYYMMDD');
      time -= 2400;
    }
    if (time.toString().length <= 3) {
      time = `0${time}`;
    }
    return {
      day: day,
      time: `${time}`
    }
  }
});
const workspaceDate = computed(() => {
  if (selectedType.value === 'leave') {
    return {
      day: date.value,
      time: endTime.value
    };
  } else {
    let time: number | string = parseInt(startTime.value) + parseInt(`${moveTime.value}00`);
    let day = date.value;
    if (time >= 2400) {
      day += dayjs(date.value).add(1, 'day').format('YYYYMMDD');
      time -= 2400;
    }
    if (time.toString().length <= 3) {
      time = `0${time}`;
    }
    return {
      day: day,
      time: `${time}`
    }
  }
});
const homeWeather = computed(() => home.value?.[homeDate.value.day]?.[homeDate.value.time]);
const workspaceWeather = computed(() => workspace.value?.[workspaceDate.value.day]?.[workspaceDate.value.time]);
const isPass = computed(() => {
  if (selectedDate.value === 'today') {
    if (selectedType.value === 'goto') {
      return dayjs(`${workspaceDate.value.day}${workspaceDate.value.time}`) < today;
    } else {
      return dayjs(`${homeDate.value.day}${homeDate.value.time}`) < today;
    }
  } else {
    return false
  }
});
const pm10Dust = computed(() => fineDust.value?.[date.value]['PM10']);
const pm25Dust = computed(() => fineDust.value?.[date.value]['PM10']);
const o3Dust = computed(() => fineDust.value?.[date.value]['O3']);


onMounted(async () => {
  if (homeAddress.value) {
    getHomeWeather();
  }
  if (workspaceAddress.value) {
    getWorkSpaceWeather();
  }
  fineDustStore.getFineDust();

  selectedDate.value = today < dayjs(`${today.format('YYYYMMDD')}${endTime.value}`) ? 'today' : 'tomorrow';
  selectedType.value = selectedDate.value === 'tomorrow' ? 'goto' : (today < dayjs(`${today.format('YYYYMMDD')}${startTime.value}`) ? 'goto' : 'leave');
});

const getHomeWeather = () => {
  const convertPosition = useConvertXY("toXY", homePosition.value.lat, homePosition.value.lng);
  weatherStore.getVilageFcstHome(convertPosition.x, convertPosition.y);
}

const getWorkSpaceWeather = () => {
  const convertPosition = useConvertXY("toXY", workspacePosition.value.lat, workspacePosition.value.lng);
  weatherStore.getVilageFcstWorkspace(convertPosition.x, convertPosition.y);
}
</script>

<template>
  <div class="flex flex-col gap-[30px] px-[30px] py-[30px]">
    <div class="flex flex-col gap-[20px]">
      <div class="flex justify-between items-center">
        <p class="text-[18px] font-[HSSanTokki20-Regular]"
           @click="$router.go(0)"
        >
          출퇴근길 날씨요정 🧚
        </p>
        <img
            src="@/assets/icons/ico-setting.svg" class="cursor-pointer" alt=""
            @click="$router.push('/setting')"
        >
      </div>
      <div class="flex items-start gap-[20px] justify-between">
        <div class="flex flex-col gap-[5px]">
          <div class="inline-flex items-center rounded-md shadow-sm w-fit">
            <button
                class="hover:text-blue-600 text-sm hover:bg-slate-100 border border-slate-200 rounded-l-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
                :class="selectedDate === 'today' ? 'text-blue-600 bg-slate-100': 'text-slate-800 bg-white'"
                @click="selectedDate = 'today'"
            >
              <span>오늘</span>
            </button>
            <button
                class="hover:text-blue-600 text-sm hover:bg-slate-100 border border-slate-200 rounded-r-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
                :class="selectedDate === 'tomorrow' ? 'text-blue-600 bg-slate-100': 'text-slate-800 bg-white'"
                @click="selectedDate = 'tomorrow'"
            >
              <span>내일</span>
            </button>
          </div>
          <p class="text-[13px] text-gray-500">
            {{ dayjs(date).format('YYYY. MM. DD') }}
          </p>
        </div>
        <div class="flex flex-col gap-[5px]">
          <div class="inline-flex items-center rounded-md shadow-sm w-fit">
            <button
                class="hover:text-amber-600 text-sm hover:bg-slate-100 border border-slate-200 rounded-l-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
                :class="selectedType === 'goto' ? 'text-amber-600 bg-slate-100': 'text-slate-800 bg-white'"
                @click="selectedType = 'goto'"
            >
              <span>출근길</span>
            </button>
            <button
                class="hover:text-purple-600 text-sm hover:bg-slate-100 border border-slate-200 rounded-r-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
                :class="selectedType === 'leave' ? 'text-purple-600 bg-slate-100': 'text-slate-800 bg-white'"
                @click="selectedType = 'leave'"
            >
              <span>퇴근길</span>
            </button>
          </div>
          <div class="text-[13px] text-gray-500 flex justify-between">
            <p>
              {{ `출근 : ${startTime.substring(0, 2)}시` }}
            </p>
            <p>
              {{ `퇴근 : ${endTime.substring(0, 2)}시` }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!homeAddress || !workspaceAddress"
         class="flex flex-col items-center gap-[10px]">
      <p class="text-[20px] text-center ">
        집/회사 설정을 먼저 해주세요
      </p>
      <button
          class="text-gray-700 border rounded-[10px] px-[6px] py-[4px] border-gray-300 text-[14px] shadow"
          @click="$router.push('/setting')"
      >
        설정
      </button>
    </div>
    <template
        v-else-if="!isPass"
    >
      <div class="flex items-center gap-[20px]"
           v-if="home && workspace"
           :class="selectedType === 'goto' ? 'flex-col' : 'flex-col-reverse' "
      >
        <div class="flex flex-col gap-[10px] items-center">
          <p class="text-gray-500 text-[18px]">
            {{ `집 : ${homeDate.time.substring(0, 2)}시` }}
          </p>
          <div class="flex flex-col items-center">
            <div class="flex gap-[10px] items-center">
              <Vue3Lottie
                  :animation-data="useGetWeatherJson(useGetWeather(homeWeather?.SKY, homeWeather?.PTY))"
                  :height="150"
                  :width="150"
                  :speed="1.3"
                  :loop="true"
                  class="overflow-hidden"
              />
              <div class="flex flex-col gap-[10px]">
                <p class="text-[26px]">
                  {{ `${homeWeather?.TMP}°C` }}
                </p>
                <p class="text-[26px]">
                  {{ `${homeWeather?.WSD}m/s` }}
                </p>
              </div>
            </div>
            <p class="text-gray-700 text-[12px]">
              {{ useGetRainyText(homeWeather?.SKY, homeWeather?.PTY) }}
              {{ useGetWindyText(homeWeather?.WSD) }}
            </p>
          </div>
        </div>
        <div class="w-full h-[1px] bg-gray-100"/>
        <div class="flex flex-col gap-[10px] items-center">
          <p class="text-gray-500 text-[18px]">
            {{ `회사 : ${workspaceDate.time.substring(0, 2)}시` }}
          </p>
          <div class="flex flex-col items-center">
            <div class="flex gap-[10px] items-center">
              <Vue3Lottie
                  :animation-data="useGetWeatherJson(useGetWeather(workspaceWeather?.SKY, workspaceWeather?.PTY))"
                  :height="150"
                  :width="150"
                  :speed="1.3"
                  :loop="true"
                  class="overflow-hidden"
              />
              <div class="flex flex-col gap-[10px]">
                <p class="text-[26px]">
                  {{ `${workspaceWeather?.TMP}°C` }}
                </p>
                <p class="text-[26px]">
                  {{ `${workspaceWeather?.WSD}m/s` }}
                </p>
              </div>
            </div>
            <p class="text-gray-700 text-[12px]">
              {{ useGetRainyText(workspaceWeather?.SKY, workspaceWeather?.PTY) }}
              {{ useGetWindyText(workspaceWeather?.WSD) }}
            </p>
          </div>
        </div>
      </div>
      <div
          v-else
          class="flex flex-col items-center"
      >
        <Vue3Lottie
            :animation-data="LoadingJson"
            :height="200"
            :width="200"
            :speed="1"
            :loop="true"
        />
        날씨 확인중...
      </div>
      <div v-if="fineDust" class="flex flex-col gap-[10px]">
        <div class="flex flex-col gap-[3px]"
          v-if="pm10Dust">
          <p class="font-bold text-[12px]">
            미세먼지 : {{pm10Dust?.dataTime}}
          </p>
          <p class="text-[13px] text-black">
            {{ pm10Dust?.informCause }}
          </p>
        </div>
        <div class="flex flex-col gap-[3px]"
             v-if="pm25Dust"
        >
          <p class="font-bold text-[12px]">
            초미세먼지 : {{pm25Dust?.dataTime}}
          </p>
          <p class="text-[13px] text-black">
            {{ pm25Dust?.informCause?.replaceAll('미세먼지', '초미세먼지') }}
          </p>
        </div>
        <div class="flex flex-col gap-[3px]"
             v-if="o3Dust"
        >
          <p class="font-bold text-[12px]">
            오존: {{o3Dust?.dataTime}}
          </p>
          <p class="text-[13px] text-black">
            {{ o3Dust?.informCause }}
          </p>
        </div>
      </div>
    </template>
    <div v-else
         class="flex items-center justify-center">
      지난 시간은 볼수 없어요
    </div>
  </div>
</template>

<style scoped>

</style>