import { CHANNEL_INR, CHANNEL_USD, DateToStringFormat, Failure, Success, USDAmt, dropdown, generateRandomCode, useSetState } from '@/utils/functions';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Modal from '@/components/Modal';
import { DataTable, DataTableProps } from 'mantine-datatable';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import Select from 'react-select';
import { useMutation, useQuery } from '@apollo/client';
import { COUNTRY_LIST, COUPON_CHANNEL_UPDATE, COUPON_META_DATA, CREATE_COUPEN } from '@/query/product';
import { Description } from '@headlessui/react/dist/components/description/description';
import PrivateRouter from '@/components/Layouts/PrivateRouter';
import IconLoader from '@/components/Icon/IconLoader';
import { CREATE_SHIPPING_METHOD, CREATE_ZONE, UPDATE_CHANNEL_LIST_UPDATE, ZONE_DETAILS } from '@/query/shipping_zone';

const CreateCoupon = () => {
    const router = useRouter();

    const { id } = router.query;
    console.log('✌️id  --->', id);

    const [createZone, { loading: createLoading }] = useMutation(CREATE_ZONE);
    const [createZippingMethod, { loading: createShippingMethodLoading }] = useMutation(CREATE_SHIPPING_METHOD);
    const [updateChannelList, { loading: channelListLoading }] = useMutation(UPDATE_CHANNEL_LIST_UPDATE);

    const { data: productSearch, refetch: zoneDetails } = useQuery(ZONE_DETAILS);

    const [channelUpdate, { loading: chennelLoading }] = useMutation(COUPON_CHANNEL_UPDATE);

    const [metaData, { loading: metaLoading }] = useMutation(COUPON_META_DATA);

    const { data: country } = useQuery(COUNTRY_LIST);

    const [state, setState] = useSetState({
        couponName: '',
        nameError: '',
        visible: false,
        typeOfCode: '',
        isOpen: false,
        couponNameErr: '',
        autoCode: false,
        autoCodeNumber: '',
        autoCodeNumberErr: '',
        generatedCodes: [],
        codeOption: [],
        minimumReqOption: [],
        usageOption: [],
        couponValue: '',
        usageLimit: { value: 'Limit number of times this discount can be used in total', label: 'Limit number of times this discount can be used in total' },
        minimumReq: { value: 'None', label: 'None' },
        maxReq: { value: 'None', label: 'None' },
        maxReqOption: [],
        maxReqValueError: '',
        maxReqValue: '',
        minimumReqValue: '',
        usageValue: '',
        isEndDate: false,
        startDate: new Date().toISOString().slice(0, 16),
        endDate: '',
        description: '',
        codeType: { value: 'Fixed Amount', label: 'Fixed Amount' },
        manualCode: '',
        manualCodeErr: '',
        errors: null,
        autoApply: false,
        invidual: false,

        selectedCountry: '',
    });

    useEffect(() => {
        getCountryList();
    }, [country]);

    useEffect(() => {
        getDetails();
    }, [id]);

    const getDetails = async () => {
        try {
            const res = await zoneDetails({
                id: id,
            });
            console.log('✌️res --->', res);
        } catch (error) {
            console.log('✌️error --->', error);
        }
    };

    const getCountryList = async () => {
        try {
            const dropdownData = country?.shop?.countries?.map((item: any) => {
                return { value: item.code, label: item.country };
            });
            console.log('✌️dropdownData --->', dropdownData);
            const exceptIndia = dropdownData?.filter((item) => item.value != 'IN').map((value) => value.value);
            console.log('✌️exceptIndia --->', exceptIndia);
            setState({ countryList: dropdownData, exceptIndia });
            // setParentLists(getparentCategoryList);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const handleMenuClick = (e) => {
        setState({ visible: false, typeOfCode: e.key });
        if (e.key === 'manual') {
            setState({ isOpen: true, couponNameErr: '' });
        } else {
            setState({ autoCode: true, autoCodeNumber: '', autoCodeNumberErr: '' });
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="standard">Standard Shipping</Menu.Item>
            <Menu.Item key="express">Express Shipping</Menu.Item>
        </Menu>
    );

    const addManualCode = () => {
        if (state.manualCode == '') {
            setState({ manualCodeErr: 'Please enter coupon code' });
        } else {
            setState({ isOpen: false, manualCodeErr: '', manualCode: '', generatedCodes: [...state.generatedCodes, state.manualCode], errors: { generatedCodesError: '' } });
        }
    };

    const addGenerateCode = () => {
        if (state.autoCodeNumber == '') {
            setState({ autoCodeNumberErr: 'Please enter coupon code quantity' });
        } else {
            const quantity = parseInt(state.autoCodeNumber, 10);
            if (isNaN(quantity) || quantity <= 0 || quantity > 50) {
                setState((prevState) => ({
                    ...prevState,
                    autoCodeNumberErr: 'Please enter a valid number between 1 and 50',
                }));
                return;
            }
            const codes = Array.from({ length: quantity }, generateRandomCode);
            setState({
                generatedCodes: [...state.generatedCodes, ...codes],
                autoCodeNumberErr: '',
                autoCode: false,
                errors: { generatedCodesError: '' },
            });
        }
    };

    const deleteCode = (row) => {
        const filter = state.generatedCodes?.filter((item) => item !== row);
        setState({ generatedCodes: filter });
    };

    const handleStartDateChange = (e) => {
        setState({
            startDate: e.target.value,
            endDate: '', // Clear endDate when startDate changes
        });
    };

    const handleEndDateChange = (e) => {
        setState({
            endDate: e.target.value,
            errors: { endDateError: '' },
        });
    };

    const createShippingZone = async () => {
        try {
            let errors: any = {};
            // if (state.zoneName === '') {
            //     errors.nameError = 'Shipping Zone Name is required';
            // }
            // if (state.selectedCountry === '') {
            //     errors.countryError = 'Please select country';
            // }
            // if (state.standardShippingRupee === '') {
            //     errors.standardShippingRupeeError = 'Standard Shipping (₹) is required';
            // }
            // if (state.standardShippingDollar === '') {
            //     errors.standardShippingDollarError = 'Standard Shipping ($) is required';
            // }
            // if (state.expressShippingRupee === '') {
            //     errors.expressShippingRupeeError = 'Express Shipping (₹) is required';
            // }
            // if (state.expressShippingDollar === '') {
            //     errors.expressShippingDollarError = 'Express Shipping ($) is required';
            // }
            // if (state.standardShippingRupee < 0) {
            //     errors.standardShippingRupeeError = 'Standard Shipping (₹) must be greater than 0';
            // }
            // if (state.standardShippingDollar < 0) {
            //     errors.standardShippingDollarError = 'Standard Shipping ($) must be greater than 0';
            // }
            // if (state.expressShippingRupee < 0) {
            //     errors.expressShippingRupeeError = 'Express Shipping (₹) must be greater than 0';
            // }
            // if (state.expressShippingDollar < 0) {
            //     errors.expressShippingDollarError = 'Express Shipping ($) must be greater than 0';
            // }

            if (Object.keys(errors).length > 0) {
                setState({ errors });
                return;
            }

            const body = {
                name: state.zoneName,
                countries:state.exceptIndia,
                default: false,
                addChannels: [CHANNEL_USD],

            };

            console.log('✌️body --->', body);

            const res = await createZone({
                variables: {
                    input: body,
                },
            });

            if (res?.data?.shippingZoneCreate?.errors?.length > 0) {
                Failure(res.data.shippingZoneCreate.errors[0].message);
            } else {
                const zoneId = res.data.shippingZoneCreate.shippingZone.id;
                shippingMethodCreate(zoneId);
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const shippingMethodCreate = async (zoneId: string) => {
        try {
            const arr = [
                {
                    name: 'Standard Shipping',
                    description: state.description,
                    type: 'PRICE',
                    shippingCosts: [
                        {
                            channelId: CHANNEL_USD,
                            amount: Number(state.standardShippingRupee),
                            currency: 'INR',
                        },
                        // {
                        //     channelId: CHANNEL_INR,
                        //     amount: Number(state.standardShippingDollar),
                        //     currency: 'USD',
                        // },
                    ],
                },
                // {
                //     name: 'Express Shipping',
                //     description: state.description,
                //     type: 'PRICE',
                //     shippingCosts: [
                //         {
                //             channelId: CHANNEL_USD,
                //             amount: Number(state.expressShippingRupee),
                //             currency: 'INR',
                //         },
                //         {
                //             channelId: CHANNEL_INR,
                //             amount: Number(state.expressShippingDollar),
                //             currency: 'USD',
                //         },
                //     ],
                // },
            ];

            const promises = arr.map(async (shippingOption) => {
                const response = await createZippingMethod({
                    variables: {
                        input: {
                            name: shippingOption.name,
                            shippingZone: zoneId,
                            type: shippingOption.type,
                        },
                    },
                });

                const shippingMethodId = response.data.shippingPriceCreate.shippingMethod.id;
                await updateChannelLists(shippingMethodId, shippingOption.shippingCosts);
            });

            await Promise.all(promises);
        } catch (error) {
            console.error('zippingMethodCreate error: ', error);
        }
    };

    const updateChannelLists = async (shippingMethodId: string, shippingCosts: any[]) => {
        try {
            const addChannels = shippingCosts.map((item) => ({
                channelId: item.channelId,
                price: item.amount,
            }));

            const res = await updateChannelList({
                variables: {
                    id: shippingMethodId,
                    input: {
                        addChannels,
                    },
                },
            });
            router.push('/shipping_zone');
            Success('Shipping Zone Created successfully');

            console.log('Channel listing updated:', res);
        } catch (error) {
            console.error('updateChannelLists error: ', error);
        }
    };

    const codeType = () => {
        const arr = ['Fixed Amount', 'Percentage', 'Free Shipping'];
        const arr1 = ['None', 'Minimal order value', 'Minimum quantity of items'];
        const arr3 = ['None', 'Maximum order value'];
        const arr2 = ['Limit number of times this discount can be used in total', 'Limit to one use per customer', 'Limit to staff only', 'Limit to voucher code use once'];
        const type1 = dropdown(arr1);
        const type = dropdown(arr);
        const type2 = dropdown(arr2);
        const type3 = dropdown(arr3);

        setState({ codeOption: type, usageOption: type2, minimumReqOption: type1, maxReqOption: type3 });
    };

    return (
        <>
            <div className="panel mb-5 flex items-center justify-between gap-5">
                <h5 className="text-lg font-semibold dark:text-white-light">Update Shipping Zone</h5>
            </div>
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
                        />
                        {state.errors?.nameError && <p className="mt-[4px] text-[14px] text-red-600">{state.errors?.nameError}</p>}
                    </div>
                </div>
            </div>

            <div className="panel   ">
                <div className=" w-full   ">
                    <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                        Shipping Methods
                    </label>

                    {/* <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                        Country
                    </label> */}
                    {/* <Select
                        placeholder="Select countries"
                        options={state.countryList}
                        value={state.selectedCountry}
                        onChange={(data: any) => setState({ selectedCountry: data })}
                        isSearchable={true}
                        isMulti={true}
                    /> */}
                    {/* {state.errors?.countryError && <p className="mt-[4px] text-[14px] text-red-600">{state.errors?.countryError}</p>}
                    {state.selectedCountry && ( */}
                    <>
                        <div className="flex w-full gap-5 pt-5">
                            <div className="col-6 md:w-6/12">
                                <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                                     Shipping Price (₹)
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

                            {/* <div className="col-6 md:w-6/12">
                                <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                                    Standard Shipping ($)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={state.standardShippingDollar}
                                        onChange={(e) => setState({ standardShippingDollar: e.target.value, errors: { standardShippingDollarError: '' } })}
                                        placeholder="Enter amount"
                                        name="name"
                                        className="form-input"
                                        required
                                    />
                                </div>
                                {state.errors?.standardShippingDollar && <p className="mt-[4px] text-[14px] text-red-600">{state.errors?.standardShippingDollar}</p>}
                            </div> */}
                        </div>
                        {/* <div className="flex w-full gap-5 pt-5">
                            <div className="col-6 md:w-6/12">
                                <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                                    Express Shipping (₹)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={state.expressShippingRupee}
                                        onChange={(e) => setState({ expressShippingRupee: e.target.value, errors: { expressShippingRupeeError: '' } })}
                                        placeholder="Enter amount"
                                        name="name"
                                        className="form-input"
                                        required
                                    />
                                </div>
                                {state.errors?.expressShippingRupeeError && <p className="mt-[4px] text-[14px] text-red-600">{state.errors?.expressShippingRupeeError}</p>}
                            </div>

                            <div className="col-6 md:w-6/12">
                                <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                                    Express Shipping ($)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={state.expressShippingDollar}
                                        onChange={(e) => setState({ expressShippingDollar: e.target.value, errors: { expressShippingDollarError: '' } })}
                                        placeholder="Enter amount"
                                        name="name"
                                        className="form-input"
                                        required
                                    />
                                </div>
                                {state.errors?.expressShippingDollarError && <p className="mt-[4px] text-[14px] text-red-600">{state.errors?.expressShippingDollarError}</p>}
                            </div>
                        </div> */}
                    </>
                    {/* )} */}
                </div>
            </div>
            {/* <div className="panel mt-5">
                <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="ctnTextarea"
                    value={state.description}
                    onChange={(e) => setState({ description: e.target.value })}
                    rows={3}
                    className="form-textarea"
                    placeholder="Enter Description"
                    required
                ></textarea>
            </div> */}

            <div className="panel">
                <div className="mt-5 flex items-center justify-end gap-4">
                    <button type="button" className="btn btn-primary  w-full md:mb-0 md:w-auto" onClick={() => createShippingZone()}>
                        {createLoading || chennelLoading ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                    </button>
                    <button type="button" className="btn btn-danger  w-full md:mb-0 md:w-auto" onClick={() => router.push('/shipping_zone')}>
                        {'Cancel'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default PrivateRouter(CreateCoupon);
