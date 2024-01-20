import { Card, Text } from '@mantine/core';
import { buttonUrls } from './api/MusicData';
import CustomCard from '@/components/CustomCard/CustomCard';
import classes from './music.module.css';

export default function GenreButtons({ handleUpdateGenreClick, ...props }) {
  const urlGenreButtons = buttonUrls.map((buttonText, index) => {
    // const isDisabled = buttonText === '/MusicGame/TV';
    // if (buttonText === '/MusicGame/Gay Icons') {
    //   buttonText = '/MusicGame/GayIcons';
    // } else if (buttonText === '/MusicGame/Hip Hop') {
    //   buttonText = '/MusicGame/HipHop';
    // }

    // const cardClassName = `${classes.myCard} ${props.className || ''}`;
    return (
      <CustomCard key={index} className={classes.genreCard}>
        <Card.Section className="text-center" onClick={() => handleUpdateGenreClick(buttonText)}>
          <Text size="lg" fw={500}>
            {buttonText.replace('/MusicGame/', '')}
          </Text>
        </Card.Section>
      </CustomCard>
    );
  });

  return <>{urlGenreButtons}</>;
}
