import Image from 'next/image';
import { AspectRatio } from '@mantine/core';

import { buttonUrlsImages } from './api/MusicData';

// IntroImages component
type IntroImagesProps = {
  selectedGenre?: string;
};

export function GenreImages({ selectedGenre, props }: IntroImagesProps) {
  const filteredImages = buttonUrlsImages?.filter((item) => item.url.includes(selectedGenre));

  // Access the first image directly as we expect only one image
  const image = filteredImages[0].image;
  return (
    <AspectRatio ratio={10 / 10} {...props}>
      <Image
        src={image}
        alt={image}
        fill={true}
        sizes="100vw, 100vw, 100vw"
        // className="h-full w-full object-cover"
        // priority={true}
        blurDataURL="/static/cover-arts/1950s.jpg"
      />
    </AspectRatio>
  );
}
