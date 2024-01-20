import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, SONGS_URL } from '@/lib/fetchdata/apiURLs';
import { Playlist } from '@/components/Music/audioplayer/types';
import { type SongData } from './GenreSongs';

const fetchMusicData = async ({ url, params }) => {
  try {
    const response = await axios.get(BASE_URL + url, params);
    return response.data;
  } catch (error) {
    // console.error(error);
    throw error;
  }
};

const useFetchSong = (fetchParams: SongData) => {
  const [playlist, setPlaylist] = useState<Playlist>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSong = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchMusicData({
          url: SONGS_URL,
          params: {
            responseType: 'blob',
            params: {
              genre: `/${fetchParams.genre}`,
              song_number: fetchParams.song_number,
            },
          },
        });

        const audioBlob = new Blob([response], { type: 'audio/mpeg' });
        const audioSrc = URL.createObjectURL(audioBlob);
        setPlaylist([
          {
            audioSrc: audioSrc,
            metadata: {
              title: fetchParams.title, // Replace with actual data if available
              artist: fetchParams.artist,
              coverArtSrc: '',
            },
          },
        ]);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSong();
  }, [fetchParams.song_number]);

  return { playlist, isLoading, error };
};

export { useFetchSong };
