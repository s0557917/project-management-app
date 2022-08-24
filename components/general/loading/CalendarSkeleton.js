import { Skeleton } from "@mantine/core"

export default function CalendarSkeleton() {
    return (
        <div>
            <div className="my-2 flex justify-between items-center">
                <Skeleton height={70} width="15%" />
                <Skeleton height={70} width="40%" />
                <Skeleton height={70} width="15%" />
            </div>
            <Skeleton height={500} width="100%" />
        </div>
    )
}