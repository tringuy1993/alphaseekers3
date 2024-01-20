type SongInfoProps = {
  title?: string;
  artist?: string;
  // coverArtSrc?: string;
};

const SongInfo = ({ title, artist }: SongInfoProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <span
      style={{
        fontSize: '1.5rem',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Example shadow, adjust as needed
        color: 'yourPrimaryColor', // Replace with your actual primary color
      }}
    >
      {title}
    </span>
    <span
      style={{
        fontSize: '1rem',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Example shadow, adjust as needed
        color: 'yourPrimaryColor', // Replace with your actual primary color
      }}
    >
      {artist}
    </span>
  </div>
);
export default SongInfo;
