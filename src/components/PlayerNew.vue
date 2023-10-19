<template>
  <div class="audio-player">
    <div class="player-description">
      <img class="track-image" :src="track.thumbnail" alt="track-image">
      <p class="title">{{ track.song }}</p>
      <p class="subtitle">{{ track.artist }}</p>
      <div>
        <IconHeart v-if="!track.favorite" class="icon" @click="addToFavorites(track.id)"/>
        <IconHeartFilled v-else class="icon" @click="removeFromFavorites(track.id)"/>
      </div>
    </div>
    <div class="timeline">
      <div id="timer">{{timelineState.currentTime ?? '0:00'}}</div>
      <div class="progress-container">
        <div id="progress" class="progress" :style="{ width : timelineState.barWidth }"></div>
      </div>
      <div id="duration">{{ track.duration }}</div>
    </div>
    
    <div class="controls">
      <button class="btn" @click="emit('previousTrack', track)">
        <IconPlayerSkipBackFilled color="#8E8ABD"/>
      </button>
      <button v-if="!isPlaying" class="btn play" @click="playTrack">
        <IconPlayerPlayFilled size="34" color="#F4603E"/>
      </button>
      <button v-else class="btn pause" @click="pauseTrack">
        <IconPlayerPauseFilled size="34" color="#F4603E"/>
      </button>
      <button class="btn next" @click="emit('nextTrack', track)">
        <IconPlayerSkipForwardFilled color="#8E8ABD"/>
      </button>
    
    </div>
  </div>
</template>

<script setup>
import {
  IconHeart,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconPlayerPlayFilled,
  IconPlayerPauseFilled, IconHeartFilled
} from '@tabler/icons-vue';
import {onMounted, reactive, watch} from 'vue';
import useTracks, {addToFavorites, play, removeFromFavorites, stopPlaying} from '@/moduls/track';

const props = defineProps({
  track: {
    type: Object,
  },
  playNow: {
    type: Boolean,
    required: false,
  }
});

const emit = defineEmits(['nextTrack', 'previousTrack', 'changeTrack', 'update:playNow', 'toggleFavorite']);

const { isPlaying } = useTracks();
watch(()=>props.track, ()=> {
  resetTimelineState();
  audio.src = props.track.audio;
  if(isPlaying.value) {
    playTrack();
  }
  else{
    pauseTrack();
  }
})

watch(isPlaying, ()=> {
  if(isPlaying.value) {
    playTrack();
    play();
  }
  else{
    pauseTrack();
  }
})


const audio = new Audio();
audio.src = props.track.audio;

const timelineState = reactive({
  duration: null,
  currentTime: null,
  barWidth: null,
  percentage: null,
  
});

const resetTimelineState = () => {
  timelineState.duration = null;
  timelineState.currentTime = null;
  timelineState.barWidth = null;
  timelineState.percentage = null;
}

// Function to play the current track
const playTrack = () => {
  audio.play();
  play();
};

// Function to pause the current track
const pauseTrack = () => {
  audio.pause();
  stopPlaying();
  
};
const toggleFavorite = id => {
  emit('toggleFavorite', props.track.id);
};

const generateTime = () => {
  let width = (100 / audio.duration) * audio.currentTime;
  timelineState.barWidth = width + '%';
  timelineState.percentage = width + '%';
  let durmin = Math.floor(audio.duration / 60);
  let dursec = Math.floor(audio.duration - durmin * 60);
  let curmin = Math.floor(audio.currentTime / 60);
  let cursec = Math.floor(audio.currentTime - curmin * 60);
  if (durmin < 10) {
    durmin = '0' + durmin;
  }
  if (dursec < 10) {
    dursec = '0' + dursec;
  }
  if (curmin < 10) {
    curmin = '0' + curmin;
  }
  if (cursec < 10) {
    cursec = '0' + cursec;
  }
  timelineState.duration = durmin + ':' + dursec;
  timelineState.currentTime = curmin + ':' + cursec;
  window.localStorage.currentTime = audio.currentTime;
  window.localStorage.isFinished = width === 100;
};

// Event listener to load the next track when the current track ends
audio.addEventListener("ended", () => {
  emit(' nextTrack' );
  
});

onMounted(() => {
  audio.ontimeupdate = function () {
    generateTime();
  };
});
</script>

<style scoped>



</style>