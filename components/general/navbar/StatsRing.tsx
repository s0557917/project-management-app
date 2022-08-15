import { RingProgress, Text } from '@mantine/core';
import { ArrowUp, ArrowDown } from 'phosphor-react';

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
  const Icon = icons[data.icon];
  return (
      <div> 
        <div className='flex items-center pt-1'>
          <RingProgress
            size={55}
            roundCaps
            thickness={4}
            sections={[{ value: data.progress, color: data.color }]}
            label={
              <p className='text-center text-xl text-white font-bold'>
                {data.stats}
              </p>
            }
          />

        </div>
      </div>
  );
}