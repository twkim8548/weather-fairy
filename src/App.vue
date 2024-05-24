<script setup lang="ts">
import {useModalStore} from "@/stores/modal.ts";
import {storeToRefs} from "pinia";
import {onMounted, onUnmounted} from "vue";

const isDeviceIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);

const modalStore = useModalStore();
const { isShowAppDownloadModal } = storeToRefs(modalStore);

let deferredPrompt: any;

const deferredPromptEvent = (e: any) => {
  e.preventDefault();
  modalStore.setModalState(true);
  deferredPrompt = e;
}

const installApp =() => {
  if (!deferredPrompt) {
    return;
  }
  modalStore.setIsShowAppDownloadModal(false);
  deferredPrompt.prompt();
}

onMounted(() => {
  window.addEventListener("beforeinstallprompt", deferredPromptEvent);
})

onUnmounted(() => {
  window.removeEventListener("beforeinstallprompt", deferredPromptEvent);
});
</script>

<template>
  <div class="max-w-[100svw] min-h-[100svh] flex justify-center">
    <router-view class="max-w-[800px] w-full"/>
    <transition name="slide-fade" mode="out-in">
      <div
          v-if="$route.name !== '/' && isShowAppDownloadModal"
          class="fixed bottom-0 w-full max-w-[800px] bg-white border-t rounded-t-[20px] min-h-[200px] drop-shadow-2xl p-[20px] flex flex-col">
        <button class="w-fit self-end" @click="modalStore.setIsShowAppDownloadModal(false)">
          닫기 X
        </button>
        <div class="flex flex-col gap-[20px]">
          <p class="text-[20px]">
            앱으로 다운받아 사용해보세요!
          </p>
          <div class="flex gap-[10px] items-center justify-center"
               v-if="isDeviceIOS">
            <img
                src="https://help.apple.com/assets/65A1EE686941F773B70429B4/65A1EE691C8D00FB3607FFD7/ko_KR/197e575aa407b2e8a25b6d966b3169c4.png"
                alt=""
                class="h-[30px]"
            />
            <p class="text-[14px]">
              Safari 앱 아래 공유 버튼 을 클릭한 후,<br><b>[홈 화면에 추가]</b>를 선택해 주세요.
            </p>
          </div>
          <div v-else
               class="flex justify-center"
          >
            <button
                class="cursor-pointer border bg-slate-600 text-white px-[20px] py-[10px] rounded-[20px]"
                @click="installApp"
            >
              설치하기
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>