import { LIVE_OTM_UTICKERS } from '@/lib/fetchdata/apiURLs';
import useCustomSWR from '@/lib/fetchdata/fetch-custom';
import MainLoading from '../loading';

import SelectWrapper from '@/components/SelectWrapper';
import { uTickerType } from './types';

type SelectUtickerProps = {
  uTicker: string;
  setUTicker: (ticker: string) => void;
  size?: string;
};

export function SelectUticker({ uTicker, setUTicker, size }: SelectUtickerProps) {
  const { data: uTickerList, isLoading } = useCustomSWR(LIVE_OTM_UTICKERS);

  if (!uTickerList || isLoading) {
    return <MainLoading />;
  }

  const convertedArray = uTickerList?.data.map((item: uTickerType) => ({
    label: item.uticker,
    value: item.uticker,
  }));

  return (
    <SelectWrapper
      label="Ticker"
      data={convertedArray}
      value={uTicker}
      onChange={(e: string | null) => {
        if (e) {
          setUTicker(e);
        }
      }}
      size={size}
      miw={180}
    />
  );
}
