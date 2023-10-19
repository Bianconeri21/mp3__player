import {reactive, toRefs} from 'vue';
import axios from 'axios';

const trackState = reactive({
  tracksData: [],
  favoriteTracks: [],
  currentTrack: null,
  currentTrackIndex: 0,
  isPlaying: false
});

export function getTracksData (data = null) {
  if(!data) {
    axios.get('http://localhost:3000/tracks').then((response)=> {
      data = response.data;
    })
  }
  else{
    trackState.tracksData = data;
  }
  trackState.currentTrack = trackState.tracksData[0];
}

export function changeCurrentTrack (newTrackId, index) {
  trackState.currentTrack = trackState.tracksData.find(track => track.id === newTrackId);
  trackState.currentTrackIndex = index;

}

export function changeCurrentTrackIndex (index) {
  trackState.currentTrackIndex = index;
  updateTrackInfo();
}

export function updateTrackInfo () {
  trackState.currentTrack = trackState.tracksData[trackState.currentTrackIndex];
}

export function play () {
  trackState.isPlaying = true;
}

export function stopPlaying () {
  trackState.isPlaying = false;
}

export function addToFavorites (trackIdToAddFavorites) {
  trackState.tracksData.map(track => {
    if (!trackState.favoriteTracks.includes(trackIdToAddFavorites)) {
      if (track.id === trackIdToAddFavorites) {
        track.favorite = true;
        trackState.favoriteTracks.push(trackIdToAddFavorites);
      }
    }

  });
}

export function removeFromFavorites (trackIdToRemove) {
  trackState.tracksData.map(track => {
    if (trackState.favoriteTracks.includes(trackIdToRemove)) {
      if (track.id === trackIdToRemove) {
        track.favorite = false;
        trackState.favoriteTracks = trackState.favoriteTracks.filter(item => item !== trackIdToRemove);
      }
    }

  });
}

export function resetTracksData () {
  trackState.tracksData = [];
}

export function showAllTracks () {
  resetTracksData();
  getTracksData();
}

export function showFavoriteTracks () {
  trackState.tracksData = trackState.tracksData.filter(track => track.favorite);
}

export default function useTracks () {
  return { ...toRefs(trackState) };
}