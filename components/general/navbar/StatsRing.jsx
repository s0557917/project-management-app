import { RingProgress } from '@mantine/core';
import getThemeColor from "../../../utils/color/getThemeColor";

export function StatsRing({ data, isPopoverOpen, setIsPopoverOpen }) {
  return (
        <button 
          className='flex items-center hover:scale-105 active:scale-95 cursor-pointer'
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        >
          <RingProgress
            size={50}
            roundCaps
            thickness={4}
            sections={[{ value: data.progress, color: data.color }]}
            label={
              data 
              ? <p className={`text-center text-lg font-bold ${getThemeColor('text-gray-900', 'text-white')}`}>
                {data && data.stats ? data.stats : ''}
              </p>
              : <p>...</p>
            }
          />

        </button>
  );
}