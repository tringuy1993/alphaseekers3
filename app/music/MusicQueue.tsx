import { type SongData } from './GenreSongs';
import AudioPlayer from '@/components/Music/audioplayer';
import { useFetchSong } from './hooks';
import MainLoading from '../loading';

type MusicQueueProps = {
  selectedSong: SongData;
};
const MusicQueue = ({ selectedSong }: MusicQueueProps) => {
  const { playlist, isLoading, error } = useFetchSong(selectedSong);
  if (error) {
    // console.error('ERROR HERE', error);
    return <div>Error loading song!</div>;
  }

  if (playlist.length === 0 || isLoading) {
    return <MainLoading />;
  }

  return (
    <>
      <AudioPlayer playlist={playlist} />
    </>
  );
};

export default MusicQueue;
