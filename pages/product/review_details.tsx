import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';

import 'tippy.js/dist/tippy.css';

import Dropdown from '../../components/Dropdown';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import ReviewSection from '@/components/ReviewSection';

import Swal from 'sweetalert2';
import IconEye from '@/components/Icon/IconEye';

import { useRouter } from 'next/router';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { DELETE_CUSTOMER } from '@/query/product';
import { showDeleteAlert } from '@/utils/functions';
import PrivateRouter from '@/components/Layouts/PrivateRouter';
import moment from 'moment';
import CommonLoader from '../elements/commonLoader';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconArrowForward from '@/components/Icon/IconArrowForward';
import {} from '@/utils/constant';
import { REVIEW_DETAILS } from '@/query/reviews';

const CustomerList = () => {
    const router = useRouter();
    console.log('✌️router --->', router?.query?.id);
    const PAGE_SIZE = 20;

    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [recordsData, setRecordsData] = useState([]);
    const [startCursor, setStartCursor] = useState(null);
    const [endCursor, setEndCursor] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [total, setTotal] = useState(null);
    const [selectedRecords, setSelectedRecords] = useState([]);

    const [search, setSearch] = useState('');

    const dispatch = useDispatch();

    const [removeCustomer, { loading: removeloading }] = useMutation(DELETE_CUSTOMER);

    useEffect(() => {
        dispatch(setPageTitle('Products'));
    }, [dispatch]);
    useEffect(() => {
        if (search == '' && search == undefined) {
            refresh();
        } else {
            handleSearchChange();
        }
    }, [search]);

    const {
        error,
        data: customerData,
        loading: getLoading,
        refetch: customerListRefetch,
    } = useQuery(REVIEW_DETAILS, {
        variables: {
            id:router?.query?.id,
            first: PAGE_SIZE,
            after: null,
            // filter: {
            //     dateJoined: null,
            //     numberOfOrders: null,
            //     search: search,
            // },
            productId: router?.query?.id ? [router?.query?.id] : [],
            sort: {
                direction: 'DESC',
                field: 'CREATED_AT',
            },

            PERMISSION_MANAGE_ORDERS: true,
        },
        onCompleted: (data) => {
            console.log('data: ', data);
            commonPagination(data);
        },
    });

    const {} = useQuery(REVIEW_DETAILS, {
        variables: {
            first: PAGE_SIZE,
            after: null,
            // filter: {
            //     dateJoined: null,
            //     numberOfOrders: null,
            //     search: '',
            // },
            productId: router?.query?.id ? [router?.query?.id] : [],

            sort: {
                direction: 'DESC',
                field: 'CREATED_AT',
            },

            PERMISSION_MANAGE_ORDERS: true,
        },
        onCompleted: (data) => {
            setTotal(data?.productReviews.totalCount);
        },
    });

    const [fetchNextPage] = useLazyQuery(REVIEW_DETAILS, {
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const [fetchPreviousPage] = useLazyQuery(REVIEW_DETAILS, {
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const commonPagination = (data) => {
        console.log('data: ', data);
        const customers = data?.productReviews?.edges;
        const pageInfo = data?.productReviews?.pageInfo;
        setRecordsData(
            customers?.map((item) => ({
                ...item.node,
                image: item?.node.thumbnail,
                name: `${item.node.product?.name} `,
                created_at: moment(item.node.created_at).format('YYYY-MM-DD'),
            }))
        );
        setStartCursor(pageInfo?.startCursor || null);
        setEndCursor(pageInfo?.endCursor || null);
        setHasNextPage(pageInfo?.hasNextPage || false);
        setHasPreviousPage(pageInfo?.hasPreviousPage || false);
    };

    const handleNextPage = () => {
        fetchNextPage({
            variables: {
                first: PAGE_SIZE,
                after: endCursor,
                before: null,
                // filter: {
                //     dateJoined: null,
                //     numberOfOrders: null,
                //     search: search,
                // },
                productId: router?.query?.id ? [router?.query?.id] : [],

                sort: {
                    direction: 'DESC',
                    field: 'CREATED_AT',
                },

                PERMISSION_MANAGE_ORDERS: true,
            },
        });
    };

    const handlePreviousPage = () => {
        fetchPreviousPage({
            variables: {
                last: PAGE_SIZE,
                before: startCursor,
                // filter: {
                //     dateJoined: null,
                //     numberOfOrders: null,
                //     search: search,
                // },
                productId: router?.query?.id ? [router?.query?.id] : [],

                sort: {
                    direction: 'DESC',
                    field: 'CREATED_AT',
                },

                PERMISSION_MANAGE_ORDERS: true,
            },
        });
    };

    const refresh = async () => {
        console.log('refresh: ');
        try {
            const { data } = await customerListRefetch({
                variables: {
                    last: PAGE_SIZE,
                    after: null,
                    before: null,
                    // filter: {
                    //     dateJoined: null,
                    //     numberOfOrders: null,
                    // },
                    productId: router?.query?.id ? [router?.query?.id] : [],

                    sort: {
                        direction: 'DESC',
                        field: 'CREATED_AT',
                    },

                    PERMISSION_MANAGE_ORDERS: true,
                },
            });
            commonPagination(data);
        } catch (error) {
            console.log('error: ', error);
        }
    };
    const handleSearchChange = async () => {
        const res = await customerListRefetch({
            variables: {
                last: PAGE_SIZE,
                before: startCursor,
                // filter: {
                //     dateJoined: null,
                //     numberOfOrders: null,
                //     search: search,
                // },
                productId: router?.query?.id ? [router?.query?.id] : [],

                sort: {
                    direction: 'DESC',
                    field: 'CREATED_AT',
                },

                PERMISSION_MANAGE_ORDERS: true,
            },
        });
        commonPagination(res?.data);
    };

    return (
        <div>
            <div className="panel mt-6">
                <div className="mb-10 flex flex-col gap-5 lg:mb-5 lg:flex-row lg:items-center">
                    <div className="flex items-center gap-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">Product Reviews {total !== null && `(${total})`}</h5>
                    </div>
                </div>

                <div className="datatables">{getLoading || removeloading ? <CommonLoader /> : <ReviewSection reviewList={recordsData} />}</div>
                <div className="mt-5 flex justify-end gap-3">
                    <button disabled={!hasPreviousPage} onClick={handlePreviousPage} className={`btn ${!hasPreviousPage ? 'btn-disabled' : 'btn-primary'}`}>
                        <IconArrowBackward />
                    </button>
                    <button disabled={!hasNextPage} onClick={handleNextPage} className={`btn ${!hasNextPage ? 'btn-disabled' : 'btn-primary'}`}>
                        <IconArrowForward />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivateRouter(CustomerList);
