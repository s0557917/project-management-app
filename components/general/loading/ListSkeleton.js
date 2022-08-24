import { Skeleton } from "@mantine/core"

export default function ListSkeleton() {
    return (
        <div className={`rounded-md w-4/5 mx-auto`}>
            <div className="my-6">
                <Skeleton height={200} width="100%" />
            </div>
            <div className="my-6">
                <Skeleton height={150} width="100%" />
            </div>
            <div className="my-6">	
            <Skeleton height={200} width="100%" />
            </div>
        </div>
    )
}