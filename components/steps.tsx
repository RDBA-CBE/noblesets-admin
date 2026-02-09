import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import moment from 'moment';

const Steps = ({ current, items, trackingData, onTrackClick,waybillData }) => {
    console.log('✌️trackingData --->', waybillData);
    console.log('✌️current step --->', current);
    console.log('✌️items --->', items);
    const [showTrackingModal, setShowTrackingModal] = useState(false);

    const handleTrackingClick = () => {
        if (onTrackClick) {
            onTrackClick();
        }
        setShowTrackingModal(true);
    };

    const renderTrackingModal = () => {
        if (!trackingData) return <div className="p-6">No tracking data available</div>;

        return (
            <div className="max-h-[70vh] overflow-y-auto p-6">
                <div className="mb-4">
                    <h3 className="mb-2 text-lg font-semibold">Shipment Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Waybill:</span> <span className="font-bold text-[#7d4432]">{trackingData.WaybillNo}</span>
                        </div>
                        <div>
                            <span className="font-medium">CCRCRDREF:</span> <span className="font-bold text-[#7d4432]">{waybillData?.CCRCRDREF}</span>
                        </div>
                        <div>
                            <span className="font-medium">Cluster Code:</span> <span className="font-bold text-[#7d4432]">{waybillData?.ClusterCode}</span>
                        </div>

                        
                        <div>
                            <span className="font-medium">Status:</span> <span className="font-bold">{trackingData.Status}</span>
                        </div>
                        <div>
                            <span className="font-medium">Origin:</span> <span className="font-bold">{trackingData.Origin}</span>
                        </div>
                        <div>
                            <span className="font-medium">Destination:</span> <span className="font-bold">{trackingData.Destination}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-md mb-3 font-semibold">Tracking History</h4>
                    <div className="space-y-3">
                        {trackingData.Scans?.map((scan, index) => {
                            const isCurrentStatus =
                                scan?.ScanDetail?.ScanType === trackingData?.StatusType &&
                                trackingData?.StatusDate === moment(scan?.ScanDetail?.ScanDate).format('DD MMMM YYYY') &&
                                scan?.ScanDetail?.ScanTime === trackingData?.StatusTime;

                            return (
                                <div
                                    key={index}
                                    ref={isCurrentStatus ? (el) => el?.scrollIntoView({ behavior: 'smooth', block: 'center' }) : null}
                                    className={`border-l-2 p-3 ${isCurrentStatus ? 'border-[#7d4432] bg-[#7d4432]/10' : 'border-[#7d4432]'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className={`text-sm ${isCurrentStatus ? 'font-bold text-[#7d4432]' : 'font-medium'}`}>{scan?.ScanDetail?.Scan}</p>
                                            <p className="mt-1 text-xs text-gray-600">{scan?.ScanDetail?.ScannedLocation}</p>
                                        </div>
                                        <div className="text-right text-xs text-gray-500">
                                            <div>{scan?.ScanDetail?.ScanDate}</div>
                                            <div>{scan?.ScanDetail?.ScanTime}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="my-5 w-full py-5">
                <div className="relative mx-auto flex max-w-[600px] items-center justify-between px-0 sm:max-w-full sm:px-2.5 md:px-0">
                    {items.map((item, index) => (
                        <div key={index} className="relative flex flex-1 flex-col items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`text-md relative z-[2] flex h-10 w-10 items-center justify-center rounded-full font-bold md:h-[35px] md:w-[35px] md:text-xs ${
                                        index <= current ? 'bg-[#7d4432] text-white' : 'bg-gray-300 text-gray-500'
                                    }`}
                                >
                                    {index + 1}
                                </div>

                                <div className={`mt-2 text-center text-base font-medium capitalize md:mt-1.5 md:text-sm ${index <= current ? 'text-[#7d4432]' : 'text-gray-500'}`}>{item.title}</div>
                            </div>
                            {index < items.length - 1 && (
                                <div className={`absolute left-1/2 top-5 z-[1] h-1 w-full -translate-y-1/2 md:top-[17px] ${index < current ? 'bg-[#7d4432]' : 'bg-gray-300'}`} />
                            )}

                            {/* Modern Tracking Icon */}
                            {index === current && (
                                <div className="absolute left-1/2 top-3 z-[10] -translate-x-1/2 -translate-y-1/2 md:top-[15px]">
                                    <button
                                        onClick={handleTrackingClick}
                                        className="group relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-500 bg-white text-blue-600 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-50 hover:shadow-xl"
                                        title="View Tracking Details"
                                    >
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                        <div className="absolute -inset-2 animate-ping rounded-full border-2 border-blue-300 opacity-50"></div>
                                    </button>
                                </div>
                            )}
                            {/* Debug info */}
                        </div>
                    ))}
                </div>
            </div>

            <Modal open={showTrackingModal} close={() => setShowTrackingModal(false)} renderComponent={renderTrackingModal} addHeader="Order Tracking Details" isFullWidth={false} />
        </>
    );
};

export default Steps;
