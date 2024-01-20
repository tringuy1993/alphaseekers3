import { ReactNode } from 'react';

import {
  IconArrowsShuffle2,
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPause,
  IconPlayerPlay,
  IconRepeat,
} from '@tabler/icons-react';
import { Button } from '@mantine/core';

type ControlsProps = {
  onPlayClick: () => void;
  onPrevClick: () => void;
  onNextClick: () => void;
  onRepeatClick: () => void;
  onShuffleClick: () => void;
  isPlaying: boolean;
  repeat: boolean;
  shuffle: boolean;
};

type ControlButtonProps = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

const ControlButton = ({ children, onClick, disabled }: ControlButtonProps) => {
  const variant = disabled ? 'light' : 'transparent';
  return (
    <Button variant={variant} onClick={onClick}>
      {children}
    </Button>
  );
};

const Controls = ({
  onPlayClick,
  isPlaying,
  onPrevClick,
  onNextClick,
  repeat,
  onRepeatClick,
  shuffle,
  onShuffleClick,
}: ControlsProps) => {
  // const getStyle = () => ({ stroke: `${getCssVariable("--primary")}` });

  const controlButtonList = [
    {
      id: 'shuffle',
      icon: IconArrowsShuffle2,
      onClick: onShuffleClick,
      disabled: shuffle,
    },
    { id: 'prev', icon: IconChevronLeft, onClick: onPrevClick },
    {
      id: 'play-pause',
      icon: isPlaying ? IconPlayerPause : IconPlayerPlay,
      onClick: onPlayClick,
      size: 45,
    },
    { id: 'next', icon: IconChevronRight, onClick: onNextClick },
    { id: 'repeat', icon: IconRepeat, onClick: onRepeatClick, disabled: repeat },
  ];
  return (
    <div style={{ zIndex: 10, display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
      {controlButtonList.map(({ id, icon: Icon, onClick, disabled, size }) => (
        <ControlButton key={id} onClick={onClick} disabled={disabled}>
          <Icon size={size} />
        </ControlButton>
      ))}
    </div>
  );
};

export default Controls;
