<template>
  <div class="list">
    <div v-for="(track, index) in tracks" :key="index" class="track" :class="{'active-track':  currentPlaying.id === track.id}">
      <div class="track-description">
        <div class="title">{{ track.song }}</div>
        <div class="subtitle">{{ track.artist }}</div>
      </div>
      <div class="actions">
        <div>
          <IconHeart v-if="!track.favorite" class="icon" color="#8E8ABD" @click="addToFavorites(track.id)"/>
          <IconHeartFilled v-else class="icon" color="#8E8ABD" @click="removeFromFavorites(track.id)"/>
        </div>
        <div :class="currentPlaying.id === track.id ? 'font-orange' : 'blue-btn'">
          <IconPlayerPlayFilled v-if="!isPlaying || currentPlaying.id !== track.id"
                                class="icon" @click="emit('changeTrack', track.id, index)"/>
          <IconPlayerPauseFilled v-else class="icon" @click="stopPlaying()"/>
        </div>
      </div>
      
    </div>
  </div>
  
</template>

<script setup>
import {IconHeart, IconHeartFilled, IconPlayerPauseFilled, IconPlayerPlayFilled} from '@tabler/icons-vue';
import {watch} from 'vue';
import useTracks, {
  addToFavorites,
  changeCurrentTrack, removeFromFavorites,
  showAllTracks,
  showFavoriteTracks,
  stopPlaying
} from '@/moduls/track';

const props = defineProps({
  tracks: {
    type: Array,
    required: false
  },
  currentPlaying: {
    type: Object,
    required: false,
  }
});

const emit = defineEmits(['changeTrack', 'stopPlaying', 'toggleFavorite']);
const { isPlaying } = useTracks();

watch(()=>props.tracks, ()=> {
}, {deep: true})

const toggleFavorite = (id, index) => {
  emit('toggleFavorite', id);
}
</script>

<style scoped>

</style>
