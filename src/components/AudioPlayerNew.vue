<template>
  <div class="wrapper">
    <div class="player-container">
      <PlayerNew :track="currentTrack ?? tracks[0]"
                 @previousTrack="previousTrack"
                 @nextTrack="nextTrack"
                 @toggleFavorite="toggleFavorite"/>
    </div>
    <div class="player-list">
      <TrackListNew :tracks="tracksData"
                    :currentPlaying="currentTrack"
                    @changeTrack="changeTrack"
                    @stopPlaying="stopPlaying"
                    @toggleFavorite="toggleFavorite"/>
    </div>
  </div>
</template>

<script setup>
import PlayerNew from '@/components/PlayerNew.vue';
import TrackListNew from '@/components/TrackListNew.vue';
import audioUrl1 from '../../songs/Manimal.mp3';
import audioUrl2 from '../../songs/J5.mp3';
import audioUrl3 from '../../songs/Throne.mp3';
import audioUrl4 from '../../songs/Neruda.mp3';
import { onMounted, ref} from 'vue';
import useTracks, {
  changeCurrentTrack,
  changeCurrentTrackIndex,
  getTracksData,
  play,
  updateTrackInfo
} from '@/moduls/track';


const tracks = [
  {
    id: 1,
    artist: "Artist 1",
    song: "Song 1",
    duration: "3:30",
    audio: audioUrl1,
    thumbnail: "https://img.freepik.com/free-photo/defocused-dry-autumn-leaves-nature_23-2150708277.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1697328000&semt=ais"
  },
  {
    id: 2,
    artist: "Artist 2",
    song: "Song 2",
    duration: "4:15",
    audio: audioUrl2,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH-E55Ke6zvSIAhK81K90-tJhiOsIzwodzfA&usqp=CAU"
  },
  {
    id: 3,
    artist: "Artist 3",
    song: "Song 3",
    duration: "4:15",
    audio: audioUrl3,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH-E55Ke6zvSIAhK81K90-tJhiOsIzwodzfA&usqp=CAU"
  },
  {
    id: 4,
    artist: "Artist 4",
    song: "Song 4",
    duration: "4:15",
    audio: audioUrl4,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH-E55Ke6zvSIAhK81K90-tJhiOsIzwodzfA&usqp=CAU"
  },

];


const {tracksData, currentTrack, currentTrackIndex, favoriteTracks} = useTracks();


// Function to play the previous track
const previousTrack = () => {
  changeCurrentTrackIndex((currentTrackIndex.value - 1 + tracks.length) % tracks.length);
  play()
};

// Function to play the next track
const nextTrack = () => {
  changeCurrentTrackIndex((currentTrackIndex.value + 1) % tracks.length);
  play();
};



const changeTrack = (newTrackId, index) => {
  changeCurrentTrack( newTrackId, index);
  play();
}

const stopPlaying = () => {
  currentTrack.value = null;
}

const toggleFavorite = (trackIdToAddFavorites) => {
  tracks.map(track => {
    if(track.id === trackIdToAddFavorites && track.favorite) {
      track.favorite = !track.favorite;
    }
    if(track.id === trackIdToAddFavorites && !track.favorite) {
      track.favorite = true;
      favoriteTracks.value.push(track);
    }
  })
}
onMounted(() => {
  getTracksData(tracks);
  updateTrackInfo();
});
</script>

<style scoped>
.player {
  display: flex;
  gap: 30px;
}
</style>