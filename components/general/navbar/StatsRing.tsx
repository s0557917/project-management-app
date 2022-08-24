import { RingProgress, Text } from '@mantine/core';
import { ArrowUp, ArrowDown } from 'phosphor-react';
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

const icons = {
  up: ArrowUp,
  down: ArrowDown,
};

export function StatsRing({ data }: StatsRingProps) {
  console.log("data", data);
  const Icon = icons[data.icon];
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