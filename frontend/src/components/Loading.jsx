
const LoadingSpinner = () => {
    return (
        <div className="absolute w-full h-screen bg-white flex items-center justify-center z-10">

            <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-indigo-600 z-auto"></div>
    
        </div>
    );
};

export default LoadingSpinner;