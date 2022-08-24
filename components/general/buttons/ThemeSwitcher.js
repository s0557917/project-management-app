import { createStyles, Switch, Group } from '@mantine/core';
import { Sun, Moon } from 'phosphor-react';

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    '& *': {
      cursor: 'pointer',
    },
  },

  icon: {
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 1,
    top: 3,
  },

  iconLight: {
    left: 4,
    color: theme.white,
  },

  iconDark: {
    right: 4,
    color: theme.colors.gray[6],
  },
}));

export default function ThemeSwitcher({ theme, updateThemeMutation }) {
    const { classes, cx } = useStyles();

    return (
        <Group position="center">
            <div className={classes.root}>
            <Sun className={cx(classes.icon, classes.iconLight)} size={18} />
            <Moon className={cx(classes.icon, classes.iconDark)} size={18} />
            <Switch 
              checked={theme === 'dark'} 
              onChange={(e) => {
                updateThemeMutation.mutate(e.target.checked ? 'dark' : 'light')
              }} 
              size="md" />
            </div>
        </Group>
    )
}