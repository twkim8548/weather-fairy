<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useWeatherStore} from "@/stores/weather.ts";
import {onMounted, ref} from "vue";
import {useConvertXY} from "@/composables/grid.ts";
import {Vue3Lottie} from "vue3-lottie";
import {useGetWeather, useGetWeatherJson} from "@/composables/weather.ts";

const weatherStore = useWeatherStore();
const {now} = storeToRefs(weatherStore);

const currentPosition = ref({lat: 0, lng: 0});

onMounted(() => {
})

navigator.geolocation.getCurrentPosition((position) => {
  currentPosition.value.lat = position.coords.latitude;
  currentPosition.value.lng = position.coords.longitude;
  console.log(`위도: ${position.coords.latitude}`);
  console.log(`경도: ${position.coords.longitude}`);
  const converPosition =  useConvertXY("toXY", position.coords.latitude, position.coords.longitude);
  console.log(converPosition);
  weatherStore.getVilageFcst(converPosition.x, converPosition.y);
});
</script>

<template>
  <div class="">
    <div v-for="(item, date) in now">
      {{date}}
      {{item}}
      <div v-for="(item2, time) in item">
        {{item2?.['1500']}}
      </div>
    </div>
    <Vue3Lottie
        :animation-data="useGetWeatherJson('')"
        :height="200"
        :width="200"
        :speed="1.3"
        :loop="true"
        class="overflow-hidden"
        @on-complete="$router.replace('/main')"
    />
  </div>
</template>

<style scoped>

</style>