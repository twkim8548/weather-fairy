<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useWeatherStore} from "@/stores/weather.ts";
import {storeToRefs} from "pinia";
import {VueDaumPostcode} from "vue-daum-postcode";
import {useLocationStore} from "@/stores/location.ts";

const weatherStore = useWeatherStore();
const locationStore = useLocationStore();
const {homeAddress, homePosition, workspaceAddress, workspacePosition} = storeToRefs(locationStore);
const {startTime, endTime} = storeToRefs(weatherStore);

const isShowSearchAddressModal = ref(false);
const selectedType = ref();

const onCompletePostCode = ((postCode: any) => {
  isShowSearchAddressModal.value = false;
  locationStore.getAddressToLocation(postCode?.address)
      .then((res: any) => {
        if (selectedType.value === 'home') {
          homeAddress.value = res?.data?.documents?.[0]?.address_name;
          homePosition.value = {
            lat: res?.data?.documents?.[0]?.y,
            lng: res?.data?.documents?.[0]?.x,
          }
          locationStore.setHome(homeAddress.value, homePosition.value);
        } else if (selectedType.value === 'workspace') {
          workspaceAddress.value = res?.data?.documents?.[0]?.address_name;
          workspacePosition.value = {
            lat: res?.data?.documents?.[0]?.y,
            lng: res?.data?.documents?.[0]?.x,
          }
          locationStore.setWorkspace(workspaceAddress.value, workspacePosition.value);
        }
        selectedType.value = null;
      });
})

const clickSearch = (type: string) => {
  selectedType.value = type;
  isShowSearchAddressModal.value = true;
}
onMounted(() => {
})
</script>

<template>
  <div class="flex flex-col gap-[30px] px-[30px] py-[30px]">
    <div class="flex flex-col gap-[20px]">
      <div class="flex justify-center items-center relative">
        <img
            src="@/assets/icons/ico-back.svg" alt="back"
            class="absolute cursor-pointer top-[50%] left-0 translate-y-[-50%]"
            @click="$router.go(-1)"
        >
        <p class="text-[18px]">
          설정
        </p>
      </div>
    </div>
    <div class="flex justify-between">
      <p>
        출근시간
      </p>
      <div class="flex">
        <select name="hours" class="bg-transparent appearance-none outline-none" v-model="startTime"
                @change="weatherStore.setStartTime(startTime)"
        >
          <option value="0100">1</option>
          <option value="0200">2</option>
          <option value="0300">3</option>
          <option value="0400">4</option>
          <option value="0500">5</option>
          <option value="0600">6</option>
          <option value="0700">7</option>
          <option value="0800">8</option>
          <option value="0900">9</option>
          <option value="1000">10</option>
          <option value="1100">11</option>
          <option value="1200">12</option>
          <option value="1300">13</option>
          <option value="1400">14</option>
          <option value="1500">15</option>
          <option value="1600">16</option>
          <option value="1700">17</option>
          <option value="1800">18</option>
          <option value="1900">19</option>
          <option value="2000">20</option>
          <option value="2100">21</option>
          <option value="2200">22</option>
          <option value="2300">23</option>
        </select>
        시
      </div>
    </div>
    <div class="flex justify-between">
      <p>
        퇴근시간
      </p>
      <div class="flex">
        <select name="hours" class="bg-transparent appearance-none outline-none" v-model="endTime"
                @change="weatherStore.setEndTime(endTime)">
          <option value="0100">1</option>
          <option value="0200">2</option>
          <option value="0300">3</option>
          <option value="0400">4</option>
          <option value="0500">5</option>
          <option value="0600">6</option>
          <option value="0700">7</option>
          <option value="0800">8</option>
          <option value="0900">9</option>
          <option value="1000">10</option>
          <option value="1100">11</option>
          <option value="1200">12</option>
          <option value="1300">13</option>
          <option value="1400">14</option>
          <option value="1500">15</option>
          <option value="1600">16</option>
          <option value="1700">17</option>
          <option value="1800">18</option>
          <option value="1900">19</option>
          <option value="2000">20</option>
          <option value="2100">21</option>
          <option value="2200">22</option>
          <option value="2300">23</option>
        </select>
        시
      </div>
    </div>
    <div class="flex flex-col w-full">
      <div class="flex justify-between">
        <p>
          집 위치
        </p>
        <button @click="clickSearch('home')">
          검색
        </button>
      </div>
      <p class="">
        {{ homeAddress }}
      </p>
    </div>
    <div class="flex flex-col w-full">
      <div class="flex justify-between">
        <p>
          회사 위치
        </p>
        <button @click="clickSearch('workspace')">
          검색
        </button>
      </div>
      <p class="">
        {{ workspaceAddress }}
      </p>
    </div>
    <div class="absolute inset-0 bg-white"
         v-if="isShowSearchAddressModal">
      <vue-daum-postcode class="w-full h-full" @complete="onCompletePostCode"/>
    </div>
  </div>
</template>

<style scoped>
:deep(.vue-daum-postcode-container) {
  height: 100%;
}
</style>