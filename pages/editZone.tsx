import { CHANNEL_INR, CHANNEL_USD, Success, dropdown, useSetState } from '@/utils/functions';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Select from 'react-select';
import { useMutation, useQuery } from '@apollo/client';
import { COUNTRY_LIST } from '@/query/product';
import PrivateRouter from '@/components/Layouts/PrivateRouter';
import IconLoader from '@/components/Icon/IconLoader';
import { UPDATE_CHANNEL_LIST_UPDATE, ZONE_LIST } from '@/query/shipping_zone';
import CommonLoader from './elements/commonLoader';

const CreateCoupon = () => {
    const router = useRouter();

    const { id } = router.query;

    const [updateChannelList, { loading: channelListLoading }] = useMutation(UPDATE_CHANNEL_LIST_UPDATE);

    const { data: productSearch, refetch: zoneDetails, loading: loading } = useQuery(ZONE_LIST);

    const { data: country } = useQuery(COUNTRY_LIST);

    const [state, setState] = useSetState({});

    useEffect(() => {
        getCountryList();
    }, [country]);

    useEffect(() => {
        getDetails();
    }, [id]);

    const getDetails = async () => {
        try {
            const res = await zoneDetails({
                first: 10,
                after: null,
                before: null,
                last: null,
            });

            const matchedZone = res.data?.shippingZones.edges.find((edge) => edge.node.id === id);

            if (!matchedZone) {
                console.warn('Shipping zone not found');
                return;
            }
            if (matchedZone?.node?.shippingMethods?.length > 0) {
                const standardShippingRupee = matchedZone?.node?.shippingMethods[0];
                const price = standardShippingRupee?.channelListings?.[0]?.price?.amount.toString();
                setState({ shippingMethod: matchedZone, zoneName: matchedZone?.node?.name, standardShippingRupee: price });
            }
            // Initial output structure
            // const shippingData = {
            //     standardShippingUSD: null,
            //     expressShippingUSD: null,
            //     standardShippingINR: null,
            //     expressShippingINR: null,
            // };

            // matchedZone.node.shippingMethods.forEach((method) => {
            //     method.channelListings.forEach((listing) => {
            //         const isUSD = listing.channel.name === 'USD';
            //         const isINR = listing.channel.name === 'INR';

            //         if (method.name === 'Standard Shipping') {
            //             if (isUSD) {
            //                 shippingData.standardShippingUSD = {
            //                     id: method.id,
            //                     amount: listing.price.amount,
            //                 };
            //             } else if (isINR) {
            //                 shippingData.standardShippingINR = {
            //                     id: method.id,
            //                     amount: listing.price.amount,
            //                 };
            //             }
            //         } else if (method.name === 'Express Shipping') {
            //             if (isUSD) {
            //                 shippingData.expressShippingUSD = {
            //                     id: method.id,
            //                     amount: listing.price.amount,
            //                 };
            //             } else if (isINR) {
            //                 shippingData.expressShippingINR = {
            //                     id: method.id,
            //                     amount: listing.price.amount,
            //                 };
            //             }
            //         }
            //     });
            // });

            // const arr = [];
            // arr.push(shippingData);
            // const output = Object.entries(arr[0]).map(([key, value]) => ({
            //     name: key,
            //     ...value,
            // }));

            // setState({
            //     standardShippingRupee: shippingData?.standardShippingINR?.amount?.toString(),
            //     standardShippingDollar: shippingData?.standardShippingUSD?.amount?.toString(),
            //     expressShippingRupee: shippingData?.expressShippingINR?.amount?.toString(),
            //     expressShippingDollar: shippingData?.expressShippingUSD?.amount?.toString(),
            //     zoneName: matchedZone?.node?.name,
            //     selectedCountry: matchedZone?.node?.name == 'India zone' ? { value: 'IN', label: 'India' } : { value: 'US', label: 'Other Countries' },
            //     shippingMethodId: matchedZone?.node?.id,
            //     array: output,
            // });
        } catch (error) {
            console.log('✌️error --->', error);
        }
    };

    const getCountryList = async () => {
        try {
            const dropdownData = country?.shop?.countries?.map((item: any) => {
                return { value: item.code, label: item.country };
            });

            setState({ countryList: dropdownData });
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const updateAmount = async () => {
        try {
            const res = await updateChannelList({
                variables: {
                    id: state.shippingMethod?.node?.shippingMethods?.[0]?.id,
                    input: {
                        addChannels: [
                            {
                                channelId: CHANNEL_USD,
                                price: state.standardShippingRupee,
                            },
                        ],
                    },
                },
            });
            // const addChannels = await Promise.all(
            //     state.array.map((item) =>
            //         updateChannelList({
            //             variables: {
            //                 id: item?.id,
            //                 input: {
            //                     addChannels: [
            //                         {
            //                             channelId: item?.name === 'expressShippingINR' || item?.name === 'standardShippingINR' ? CHANNEL_USD : CHANNEL_INR,
            //                             price:
            //                                 item?.name === 'standardShippingUSD'
            //                                     ? Number(state.standardShippingDollar)
            //                                     : item?.name === 'standardShippingINR'
            //                                     ? Number(state.standardShippingRupee)
            //                                     : item?.name === 'expressShippingINR'
            //                                     ? Number(state.expressShippingRupee)
            //                                     : Number(state.expressShippingDollar),
            //                         },
            //                     ],
            //                 },
            //             },
            //         })
            //     )
            // );

            router.push('/shipping_zone');
            Success('Shipping Zone updated succssfully');
        } catch (error) {
            console.error('updateChannelLists error: ', error);
        }
    };

    return (
        <>
            <div className="panel mb-5 flex items-center justify-between gap-5">
                <h5 className="text-lg font-semibold dark:text-white-light">Update Shipping Zone</h5>
            </div>
            {loading ? (
                <CommonLoader />
            ) : (
                <>
                    <div className="panel mb-5 flex ">
                        <div className="flex w-full flex-wrap  items-center ">
                            <div className="w-full md:w-6/12">
                                <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                                    Shipping Zone Name
                                </label>
                                <input
                                    type="text"
                                    value={state.zoneName}
                                    onChange={(e) => setState({ zoneName: e.target.value, errors: { nameError: '' } })}
                                    placeholder="Enter Shipping Zone Name"
                                    name="name"
                                    className="form-input"
                                    required
                                    disabled
                                />
                                {state.errors?.nameError && <p className="mt-[4px] text-[14px] text-red-600">{state.errors?.nameError}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="panel   ">
                        <div className="col-6 md:w-6/12">
                            <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                                Standard Shipping (₹)
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    value={state.standardShippingRupee}
                                    onChange={(e) => setState({ standardShippingRupee: e.target.value, errors: { standardShippingRupeeError: '' } })}
                                    placeholder="Enter amount"
                                    name="name"
                                    className="form-input"
                                    required
                                />
                            </div>
                            {state.errors?.standardShippingRupeeError && <p className="mt-[4px] text-[14px] text-red-600">{state.errors?.standardShippingRupeeError}</p>}
                        </div>
                    </div>

                    <div className="panel">
                        <div className="mt-5 flex items-center justify-end gap-4">
                            <button type="button" className="btn btn-primary  w-full md:mb-0 md:w-auto" onClick={() => updateAmount()}>
                                {channelListLoading ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                            </button>
                            <button type="button" className="btn btn-danger  w-full md:mb-0 md:w-auto" onClick={() => router.push('/shipping_zone')}>
                                {'Cancel'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default PrivateRouter(CreateCoupon);
