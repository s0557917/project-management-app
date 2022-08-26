import { RingProgress } from '@mantine/core';
import getThemeColor from "../../../utils/color/getThemeColor";


interface StatsRingProps {
  data: {
    label: string;
    stats: string;
    progress: number;
    color: string;
    icon: 'up' | 'down';
  };
}

export function StatsRing({ data }: StatsRingProps) {
  return (
        <div className='flex items-center'>
          <RingProgress
            size={50}
            roundCaps
            thickness={4}
            sections={[{ value: data.progress, color: data.color }]}
            label={
              <p className={`text-center text-lg font-bold ${getThemeColor('text-gray-900', 'text-white')}`}>
                {data.stats}
              </p>
            }
          />

        </div>
  );
}