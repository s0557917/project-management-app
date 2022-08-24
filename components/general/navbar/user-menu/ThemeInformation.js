import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTheme } from "../../../../utils/db/queryFunctions/settings";
import { getTheme } from "../../../../utils/db/queryFunctions/settings";
import ThemeSwitcher from "../../buttons/ThemeSwitcher";
import { useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";

export default function ThemeInformation() {
    
    const queryClient = useQueryClient();

    const { data: theme, isFetching: isFetchingTheme } = useQuery(['theme'], getTheme); 
    const { toggleColorScheme } = useMantineColorScheme();

    useEffect(() => {
        toggleColorScheme(theme);
    }, [isFetchingTheme])

    const updateThemeMutation = useMutation(
        (updatedTheme) => updateTheme(updatedTheme),
        {onSuccess: async () => {
            queryClient.invalidateQueries('theme');
        }}
    );

    return (
        <>
            <div className="flex mx-3 my-2 items-center">
                <p className="text-xs w-2/4">Theme</p>
                <div className="w-2/4">
                    <ThemeSwitcher 
                        theme={theme}
                        updateThemeMutation={updateThemeMutation}
                    />
                </div>
            </div>
        </>
    )
}