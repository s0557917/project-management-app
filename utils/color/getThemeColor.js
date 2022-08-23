import { useMantineColorScheme } from '@mantine/core';

export default function getThemeColor(lightColor, darkColor) {
    const { colorScheme } = useMantineColorScheme();
    return colorScheme === 'dark' ? darkColor : lightColor;

}