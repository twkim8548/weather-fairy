<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useWeatherStore} from "@/stores/weather.ts";
import {storeToRefs} from "pinia";
import {VueDaumPostcode} from "vue-daum-postcode";
import {useLocationStore} from "@/stores/location.ts";
import {useRouter} from "vue-router";

const router = useRouter();
const weatherStore = useWeatherStore();
const locationStore = useLocationStore();
const {homeAddress, homePosition, workspaceAddress, workspacePosition} = storeToRefs(locationStore);
const {startTime, endTime, moveTime} = storeToRefs(weatherStore);

const isShowSearchAddressModal = ref(false);
const selectedType = ref();
const moveTimeSelectRef = ref();

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

const clickConfirm = () => {
  if (!homeAddress.value) {
    return alert('집 위치를 설정해주세요');
  }
  if (!workspaceAddress.value) {
    return alert('회사 위치를 설정해주세요');
  }

  router.replace('/');
}
onMounted(() => {
})
</script>

<template>
  <div class="flex flex-col gap-[30px] px-[30px] py-[30px]">
    <div class="flex flex-col gap-[20px]">
      <div class="flex justify-center items-center relative">
        <p class="text-[18px]">
          설정
        </p>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <p class="text-gray-500 text-[14px]">
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
    <div class="flex justify-between items-center">
      <p class="text-gray-500 text-[14px]">
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
    <div class="flex justify-between items-center">
      <p class="text-gray-500 text-[14px]">
        이동시간
      </p>
      <div class="flex cursor-pointer">
        <select name="hours" class="bg-transparent appearance-none outline-none" v-model="moveTime"
                ref="moveTimeSelectRef"
                @change="weatherStore.setMoveTime(moveTime)">
          <option :value="1">1</option>
          <option :value="2">2</option>
          <option :value="3">3</option>
          <option :value="4">4</option>
        </select>
        <p  @click.stop="() => {moveTimeSelectRef.focus(); moveTimeSelectRef.click()}">

        시간
        </p>
      </div>
    </div>
    <div class="flex flex-col w-full">
      <div class="flex justify-between items-center">
        <p class="text-gray-500 text-[14px]">
          집 위치
        </p>
        <button @click="clickSearch('home')"
                class="border rounded-[10px] px-[6px] py-[4px] border-gray-500 text-[14px] shadow">
          검색
        </button>
      </div>
      <p class="">
        {{ homeAddress }}
      </p>
    </div>
    <div class="flex flex-col w-full">
      <div class="flex justify-between items-center">
        <p class="text-gray-500 text-[14px]">
          회사 위치
        </p>
        <button @click="clickSearch('workspace')"
                class="border rounded-[10px] px-[6px] py-[4px] border-gray-500 text-[14px] shadow">
          검색
        </button>
      </div>
      <p class="">
        {{ workspaceAddress }}
      </p>
    </div>
    <div class="absolute inset-0 bg-white flex flex-col"
         v-if="isShowSearchAddressModal">
      <vue-daum-postcode class="w-full h-full" @complete="onCompletePostCode"/>
    </div>
    <div class="self-end flex flex-col">
      <p class="text-[12px] text-gray-500">
        날씨 정보 : 기상청 제공
      </p>
    </div>
    <div class="py-[10px] border rounded-[50px] text-center" @click="clickConfirm">
      확인
    </div>
  </div>
</template>

<style scoped>
:deep(.vue-daum-postcode-container) {
  height: 100%;
}
</style>