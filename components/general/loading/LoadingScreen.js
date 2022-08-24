import { Loader } from "@mantine/core";

export default function LoadingScreen() {
    return (
        <>
            <div className="blur-sm w-full h-full"></div>
            <div className="absolute left-2/4 top-2/4">
                <Loader size={"xl"}/>
                <h1>Loading your tasks...</h1>
            </div>
        </>
    )
}