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

const weatherStore = useWeatherStore();
const locationStore = useLocationStore();
const {home, workspace, startTime, endTime} = storeToRefs(weatherStore);
const {homePosition, workspacePosition, homeAddress, workspaceAddress} = storeToRefs(locationStore);

const today = dayjs();
const currentPosition = ref({lat: 0, lng: 0});
const selectedDate = ref('today');
const selectedType = ref('leave');
const date = computed(() => selectedDate.value === 'today' ? dayjs().format('YYYYMMDD') : dayjs().add(1, 'day').format('YYYYMMDD'))
const homeWeather = computed(() => selectedType.value === 'goto' ? home.value?.[date.value]?.[startTime.value] : home.value?.[date.value]?.[endTime.value]);
const workspaceWeather = computed(() => selectedType.value === 'goto' ? workspace.value?.[date.value]?.[startTime.value] : workspace.value?.[date.value]?.[endTime.value]);
const isPass = computed(() => {
  if (selectedDate.value === 'today') {
    if (selectedType.value === 'goto') {
      return dayjs(`${today.format('YYYYMMDD')}${startTime.value}`) < today;
    } else {
      return dayjs(`${today.format('YYYYMMDD')}${endTime.value}`) < today;
    }
  } else {
    return false
  }
});


onMounted(() => {
  if (homePosition.value) {
    getHomeWeather();
  }
  if (workspacePosition.value) {
    getWorkSpaceWeather();
  }

  selectedDate.value = today < dayjs(`${today.format('YYYYMMDD')}${endTime.value}`) ? 'today' : 'tomorrow';
  selectedType.value = selectedDate.value === 'tomorrow' ? 'goto' : (today < dayjs(`${today.format('YYYYMMDD')}${startTime.value}`) ? 'goto' : 'leave');
})

navigator.geolocation.getCurrentPosition((position) => {
  currentPosition.value.lat = position.coords.latitude;
  currentPosition.value.lng = position.coords.longitude;
  console.log(`위도: ${position.coords.latitude}`);
  console.log(`경도: ${position.coords.longitude}`);

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
          <p class="text-[18px]">
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
      <div v-if="!homeAddress || !workspaceAddress">
        집/회사 설정을 먼저 해주세요
      </div>
      <template
          v-else-if="!isPass"
      >
        <div class="flex flex-col items-center gap-[20px]"
             v-if="home && workspace"
        >
          <div class="flex flex-col gap-[10px] items-center">
            <p class="text-gray-500 text-[18px]">
              집
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
              회사
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
      </template>
      <div v-else
           class="flex items-center justify-center">
        지난 시간은 볼수 없어요
      </div>
  </div>
</template>

<style scoped>

</style>