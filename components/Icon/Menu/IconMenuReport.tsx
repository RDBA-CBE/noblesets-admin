import { FC } from 'react';

interface IconMenuReportProps {
    className?: string;
}

const IconMenuReport: FC<IconMenuReportProps> = ({ className }) => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                fill="currentColor"
            />
            <path
                d="M13 12h-2v5h2v-5zm0-4h-2v2h2V8z"
                fill="currentColor"
            />
        </svg>
    );
};

export default IconMenuReport;
