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
            <div style={{ width: '25%', height: '25%', position: 'relative' }}>
                <Image src="/assets/images/Prade-Logo-Giff.gif" alt="Loading..." layout="fill" objectFit="contain" />
            </div>
        </div>
    );
}
