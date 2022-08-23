export default function IconInformation({ children, width, textColor }) {
    return (
        <div className={`mx-1 ${textColor}`}>
            <div className={`flex items-center ${width}`}>
                {children}
            </div>
        </div>
    )
}