import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconBell from '@/components/Icon/IconBell';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import IconPencil from '@/components/Icon/IconPencil';
import { Button } from '@mantine/core';
import Dropdown from '../../components/Dropdown';
import IconCaretDown from '@/components/Icon/IconCaretDown';

import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import Image1 from '@/public/assets/images/profile-1.jpeg';
import Image2 from '@/public/assets/images/profile-2.jpeg';
import Image3 from '@/public/assets/images/profile-3.jpeg';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import IconEye from '@/components/Icon/IconEye';
import { date } from 'yup/lib/locale';
import Link from 'next/link';
import { useRouter } from 'next/router';
import IconEdit from '@/components/Icon/IconEdit';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { DELETE_PRODUCTS, CUSTOMER_ALL_LIST, DELETE_CUSTOMER } from '@/query/product';
import { Failure, showDeleteAlert } from '@/utils/functions';
import PrivateRouter from '@/components/Layouts/PrivateRouter';
import moment from 'moment';
import CommonLoader from '../elements/commonLoader';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconArrowForward from '@/components/Icon/IconArrowForward';
import { commonBody } from '@/utils/constant';
import { REVIEWS_LIST } from '@/query/reviews';

const CustomerList = () => {
    const router = useRouter();
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
    } = useQuery(REVIEWS_LIST, {
        variables: {
            first: PAGE_SIZE,
            after: null,
            // filter: {
            //     dateJoined: null,
            //     numberOfOrders: null,
            //     search: search,
            // },
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

    const {} = useQuery(REVIEWS_LIST, {
        variables: {
            first: PAGE_SIZE,
            after: null,
            // filter: {
            //     dateJoined: null,
            //     numberOfOrders: null,
            //     search: '',
            // },
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

    const [fetchNextPage] = useLazyQuery(REVIEWS_LIST, {
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const [fetchPreviousPage] = useLazyQuery(REVIEWS_LIST, {
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
                productId:item.node.product?.id,
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
                sort: {
                    direction: 'DESC',
                    field: 'CREATED_AT',
                },

                PERMISSION_MANAGE_ORDERS: true,
            },
        });
        commonPagination(res?.data);
    };

    // Product table create
    const CreateProduct = () => {
        window.open('/customer/add', '_blank');
    };

    const BulkDeleteProduct = async () => {
        showDeleteAlert(
            async () => {
                const ids = selectedRecords?.map((item) => item.id);
                const res = await removeCustomer({
                    variables: {
                        ids: ids,
                    },
                });
                const updatedRecordsData = recordsData.filter((dataRecord: any) => !ids.includes(dataRecord.id));
                setRecordsData(updatedRecordsData);
                setTotal(total - ids?.length);
                Swal.fire('Deleted!', 'Your Customer has been deleted.', 'success');
                // refresh();
            },
            () => {
                Swal.fire('Cancelled', 'Your Customer List is safe :)', 'error');
            }
        );
    };

    const DeleteProduct = (row: any) => {
        showDeleteAlert(
            async () => {
                const res = await removeCustomer({
                    variables: {
                        ids: [row.id],
                    },
                });
                const updatedRecordsData = recordsData.filter((dataRecord: any) => dataRecord.id !== row.id);
                setRecordsData(updatedRecordsData);
                setTotal(total - 1);
                Swal.fire('Deleted!', 'Your Customer has been deleted.', 'success');
                // refresh();
            },
            () => {
                Swal.fire('Cancelled', 'Your Customer List is safe :)', 'error');
            }
        );
    };

    return (
        <div>
            <div className="panel mt-6">
                <div className="mb-10 flex flex-col gap-5 lg:mb-5 lg:flex-row lg:items-center">
                    <div className="flex items-center gap-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">Product Reviews {total !== null && `(${total})`}</h5>
                    </div>
                    <div className="mt-5 md:mt-0 md:flex  md:ltr:ml-auto md:rtl:mr-auto">
                        <input type="text" className="form-input  mb-3 mr-2 w-full md:mb-0 md:w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <div className="dropdown mb-3 mr-0  md:mb-0 md:mr-2">
                            <Dropdown
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="btn btn-outline-primary dropdown-toggle  lg:w-auto w-full"
                                button={
                                    <>
                                        Bulk Actions
                                        <span>
                                            <IconCaretDown className="inline-block ltr:ml-1 rtl:mr-1" />
                                        </span>
                                    </>
                                }
                            >
                                <ul className="!min-w-[170px]">
                                    <li>
                                        <button type="button" onClick={() => BulkDeleteProduct()}>
                                            Delete
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                        <button type="button" className="btn btn-primary  w-full md:mb-0 md:w-auto" onClick={() => CreateProduct()}>
                            + Create
                        </button>
                    </div>
                </div>

                <div className="datatables">
                    {getLoading || removeloading ? (
                        <CommonLoader />
                    ) : (
                        <DataTable
                            className="table-hover whitespace-nowrap"
                            records={recordsData}
                            columns={[
                                {
                                    accessor: 'image',
                                    sortable: true,
                                    render: (row) => <img src={row?.image ? row?.image : '/assets/images/placeholder.png'} alt="Product" className="h-10 w-10 object-cover ltr:mr-2 rtl:ml-2" />,
                                },
                                {
                                    accessor: 'name',
                                    sortable: true,
                                    title:"Product Name"
                                },

                                { accessor: 'created_at', sortable: true, title: 'Created Date' },

                                {
                                    accessor: 'actions',
                                    title: 'Actions',
                                    render: (row: any) => (
                                        <>
                                            <div className="items-center ">
                                                <button className="flex hover:text-info" onClick={() => window.open(`/product/review_details?id=${row.productId}`, '_blank')}>
                                                    <IconEye className="h-4.5 w-4.5" />
                                                </button>

                                                {/* <button type="button" className="flex hover:text-danger" onClick={() => DeleteProduct(row)}>
                                                    <IconTrashLines />
                                                </button> */}
                                            </div>
                                        </>
                                    ),
                                },
                            ]}
                            highlightOnHover
                            totalRecords={recordsData?.length}
                            recordsPerPage={PAGE_SIZE}
                            page={null} // Add this line to set the current page
                            onPageChange={(p) => {}} // Dummy handler for onPageChange
                            sortStatus={{
                                columnAccessor: 'name',
                                direction: 'asc',
                            }}
                            onSortStatusChange={() => {}}
                            withBorder={true}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => ''}
                            selectedRecords={selectedRecords}
                            onSelectedRecordsChange={(selectedRecords) => {
                                setSelectedRecords(selectedRecords);
                            }}
                        />
                    )}
                </div>
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
