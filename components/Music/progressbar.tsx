// import { Input } from "../ui/input";
// import { Progress } from "../ui/progress";
// import { Slider } from "../ui/slider";

import { Slider } from '@mantine/core';

type ProgressBarProps = {
  progress: number;
  onChange: (value: number) => void;
  leftLabel: string;
  rightLabel: string;
};

const ProgressBar = ({ progress, onChange, leftLabel, rightLabel }: ProgressBarProps) => (
  <div className="flex flex-col">
    <Slider
      className="w-52"
      value={progress}
      max={100}
      step={0.1}
      onChange={(event) => onChange(event)}
    />

    <div
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '4px', // Replace with the actual primary color value from your CSS
      }}
    >
      <span style={{ fontSize: '0.75rem' }}>{leftLabel}</span>
      <span style={{ fontSize: '0.75rem' }}>{rightLabel}</span>
    </div>
  </div>
);

export default ProgressBar;
