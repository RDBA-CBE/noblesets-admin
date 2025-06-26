import React, { useState } from 'react';
import PriceBreakup from './PriceBreakup';

export default function ProductTabs({ productPreview }) {
    const [activeTab, setActiveTab] = useState('Product Details');

    const renderProductDetails = () => (
        <>
            {productPreview?.description?.blocks?.map((block, index) => (
                <div key={index} className="mt-8">
                    {block?.type === 'header' && <h5 className="font-medium">{block?.data?.text}</h5>}
                    {block?.type === 'paragraph' && (
                        <p className="mb-1 text-gray-600">
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: block.data.text.includes('<b>') ? `<b>${block.data.text}</b>` : block.data.text,
                                }}
                            />
                        </p>
                    )}
                    {block?.type === 'list' && (
                        <ul className="list-disc pl-5 text-gray-600">
                            {block.data.items?.map((item, itemIndex) => (
                                <li
                                    key={itemIndex}
                                    dangerouslySetInnerHTML={{
                                        __html: item.includes('<b>') ? `<b>${item}</b>` : item,
                                    }}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            ))}

            {productPreview?.attributes?.length > 0 && (
                <div className="mt-6">
                    <p className="mb-2  text-sm">Additional Information:</p>
                    <table className="w-full border-separate border-spacing-y-2">
                        <tbody>
                            {productPreview.attributes.map((key) => (
                                <tr key={key?.id} className="border-b-[0.5px] " style={{ borderColor: '#b4633a' }}>
                                    <td className="p-0 font-bold">{key?.name}</td>
                                    <td className="p-0 text-right">
                                        {key?.values?.map((item, index) => (
                                            <span key={index}>
                                                {item}
                                                {index < key?.values?.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );

    const renderPriceBreakup = () =>
        productPreview?.priceBreakup !== null ? (
            <div className="mt-3">
                <PriceBreakup data={productPreview?.priceBreakup} />
                {/* <div
        className="text-gray-700"
        dangerouslySetInnerHTML={{ __html: productPreview?.priceBreakup }}
      /> */}
            </div>
        ) : (
            <div className="mt-4 py-4">
                <p className="mt-1 italic text-gray-600">No Price Breakup available for this product</p>
            </div>
        );

    const renderBrandDetails = () =>
        productPreview?.brand !== null ? (
            <div className="mt-8">
                <img className="h-auto w-full rounded-md" src={productPreview?.brand?.logo} alt="logo" />
                <h5 className="mb-4 mt-6 text-[22px]">{productPreview?.brand?.name}</h5>
                <p className="mt-1 text-gray-600">
                    <span
                        dangerouslySetInnerHTML={{
                            __html: productPreview?.brand?.description || '',
                        }}
                    />
                </p>
            </div>
        ) : (
            <div className="mt-4 py-4">
                <p className="mt-1 italic text-gray-600">No Brand available for this product</p>
            </div>
        );

    return (
        <div className="rounded-md">
            {/* Tabs */}
            <div className="flex space-x-6 border-b border-gray-200">
                {['Product Details', 'Price Breakup', 'About Brand'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-[#b4633a] text-[#b4633a]' : 'text-gray-600'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4 text-sm">
                {activeTab === 'Product Details' && renderProductDetails()}
                {activeTab === 'Price Breakup' && renderPriceBreakup()}
                {activeTab === 'About Brand' && renderBrandDetails()}
            </div>
        </div>
    );
}
