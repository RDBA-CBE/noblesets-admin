import Image from 'next/image';
import React from 'react'

export default function CommonLoader() {
    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div style={{ width: '6%', height: '6%', position: 'relative' }}>
                <Image src="/assets/images/nobelset-gif-2.gif" alt="Loading..." layout="fill" objectFit="contain" />
            </div>
        </div>
    );
}
