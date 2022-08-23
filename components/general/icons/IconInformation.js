export default function IconInformation({ children, width }) {
    return (
        <div className='mx-1 text-white'>
            <div className={`flex items-center ${width}`}>
                {children}
            </div>
        </div>
    )
}