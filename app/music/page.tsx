'use client';

import React, { useCallback, useState } from 'react';
import {
  ActionIcon,
  Box,
  Center,
  Container,
  Grid,
  Modal,
  Overlay,
  ScrollArea,
  SimpleGrid,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlaylist } from '@tabler/icons-react';

import { GenreImages } from './GenreImages';
import GenreSongs, { type SongData, type genreType } from './GenreSongs';
import MusicQueue from './MusicQueue';
import GenreButtons from './GenreButtons';
import { buttonUrlsImages } from './api/MusicData';
import classes from './music.module.css';

const INITIAL = {
  genre: '/2010-2014',
  song_number: 7,
  title: 'Your Song',
  artist: 'Ellie Goulding',
};

export default function PageMusic() {
  const [genre, setGenre] = useState<genreType>({ genre: '2010-2014' });
  const [selectedSong, setSelectedSong] = useState<SongData>(INITIAL);
  const [visible, setVisible] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const handleSelectedSongClick = useCallback((songObj: SongData) => {
    const { song, index, artist, genre } = songObj;
    setSelectedSong({
      title: song,
      song_number: index,
      artist: artist,
      genre: genre,
    });
  }, []);

  const handleUpdateGenreClick = useCallback((newGenre: string) => {
    const musicPath = `${newGenre.replace('/MusicGame/', '')}`;
    setGenre({ genre: musicPath });
    setSelectedSong({} as SongData);
  }, []);

  const img = buttonUrlsImages.filter((item) => {
    return item.url.includes(genre.genre);
  })[0].image;

  return (
    <Container size="xl">
      <Overlay component="img" src={img} className={classes.overlayStyle} />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Grid visibleFrom="md">
          <GenreGrid {...{ handleUpdateGenreClick, handleSelectedSongClick, genre, classes }} />
        </Grid>

        <Grid className={classes.musicPlayer}>
          <Grid.Col span={12}>
            <Center>
              <div>
                {/* {genre && <Text size="xl">{genre.genre} queued up!</Text>} */}
                <div className={classes.roundedImage}>
                  <GenreImages selectedGenre={genre.genre} />
                </div>
              </div>
            </Center>
          </Grid.Col>
          <Grid.Col span={12}>
            <Center>
              {Object.keys(selectedSong).length > 0 && <MusicQueue selectedSong={selectedSong} />}
            </Center>
          </Grid.Col>
        </Grid>
        <ActionIcon
          onClick={open}
          // fullWidth
          // maw={200}
          mx="auto"
          // mt="xl"
          className={classes.hiddenMenu}
          // style={{ zIndex: 200 }}
          size={42}
          variant="transparent"
          aria-label="Playlist"
        >
          <IconPlaylist />
        </ActionIcon>
        <Modal size="xl" opened={opened} onClose={close}>
          <GenreGrid {...{ handleUpdateGenreClick, handleSelectedSongClick, genre, classes }} />
        </Modal>
      </SimpleGrid>
    </Container>
  );
}

const GenreGrid = ({ handleUpdateGenreClick, handleSelectedSongClick, genre, classes }) => (
  <Grid>
    <Grid.Col span={4}>
      <Title>Genre</Title>
      <ScrollArea h={550} w={150}>
        <Box className={classes.scrollGenre}>
          <GenreButtons handleUpdateGenreClick={handleUpdateGenreClick} />
        </Box>
      </ScrollArea>
    </Grid.Col>
    <Grid.Col span={8}>
      <Title>{genre.genre + ` Songs`} </Title>
      <ScrollArea h={550}>
        <Box className={classes.scrollSongs}>
          <GenreSongs genre={genre} handleSelectedSongClick={handleSelectedSongClick} />
        </Box>
      </ScrollArea>
    </Grid.Col>
  </Grid>
);
