const Button = ({ children, type = 'button', onClick, className = '', disabled, loading }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`btn-primary w-full flex items-center justify-center disabled:opacity-50 ${className}`}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : null}
            {children}
        </button>
    );
};

export default Button;
