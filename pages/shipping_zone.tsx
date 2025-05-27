import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import 'tippy.js/dist/tippy.css';
import moment from 'moment';
import PrivateRouter from '@/components/Layouts/PrivateRouter';
import CommonLoader from './elements/commonLoader';
import { ABANDONT_CART_LIST, COUPON_DELETE, COUPON_LIST, PRODUCT_PREV_PAGINATION } from '@/query/product';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconArrowForward from '@/components/Icon/IconArrowForward';
import IconEdit from '@/components/Icon/IconEdit';
import IconEye from '@/components/Icon/IconEye';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import { useRouter } from 'next/router';
import { CHANNEL_INR, CHANNEL_USD, showDeleteAlert } from '@/utils/functions';
import Swal from 'sweetalert2';
import { DELETE_ZONE, ZONE_LIST } from '@/query/shipping_zone';

const PAGE_SIZE = 10;

const Coupon = () => {
    const router = useRouter();
    const [recordsData, setRecordsData] = useState([]);
    const [startCursor, setStartCursor] = useState(null);
    const [endCursor, setEndCursor] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [status, setStatus] = useState(null);

    const [deleteCoupon] = useMutation(DELETE_ZONE);

    const { loading: getLoading, refetch: fetchLowStockList } = useQuery(ZONE_LIST, {
        variables: {
            first: PAGE_SIZE,
            after: null,
            filter: {
                search,
                started: null,
                timesUsed: null,
            },
            sort: { direction: 'DESC', field: 'START_DATE' },
        },
        onCompleted: (data) => {
            console.log('✌️data --->', data);
            const products = data?.shippingZones?.edges;
            const pageInfo = data?.shippingZones?.pageInfo;
            setRecordsData(tableFormat(products));
            setStartCursor(pageInfo?.startCursor || null);
            setEndCursor(pageInfo?.endCursor || null);
            setHasNextPage(pageInfo?.hasNextPage || false);
            setHasPreviousPage(pageInfo?.hasPreviousPage || false);
        },
    });

    const [fetchNextPage] = useLazyQuery(ZONE_LIST, {
        onCompleted: (data) => {
            const products = data?.shippingZones?.edges;
            const pageInfo = data?.shippingZones?.pageInfo;
            setRecordsData(tableFormat(products));
            setStartCursor(pageInfo?.startCursor || null);
            setEndCursor(pageInfo?.endCursor || null);
            setHasNextPage(pageInfo?.hasNextPage || false);
            setHasPreviousPage(pageInfo?.hasPreviousPage || false);
        },
    });

    const [fetchPreviousPage] = useLazyQuery(ZONE_LIST, {
        onCompleted: (data) => {
            const products = data?.shippingZones?.edges;
            const pageInfo = data?.shippingZones?.pageInfo;
            setRecordsData(tableFormat(products));
            setStartCursor(pageInfo?.startCursor || null);
            setEndCursor(pageInfo?.endCursor || null);
            setHasNextPage(pageInfo?.hasNextPage || false);
            setHasPreviousPage(pageInfo?.hasPreviousPage || false);
        },
    });

    const handleNextPage = () => {
        fetchNextPage({
            variables: {
                first: PAGE_SIZE,
                after: endCursor,
                // filter: {
                //     started: null,
                //     timesUsed: null,
                // },
                sort: { direction: 'DESC', field: 'START_DATE' },
            },
        });
    };

    const handlePreviousPage = () => {
        fetchPreviousPage({
            variables: {
                last: PAGE_SIZE,
                before: startCursor,
                filter: {
                    started: null,
                    timesUsed: null,
                },
                sort: { direction: 'DESC', field: 'START_DATE' },
            },
        });
    };

    const handleSearchChange = (e) => {
        setSearch(e);
        fetchLowStockList({
            variables: {
                first: PAGE_SIZE,
                after: null,
                filter: {
                    search: e,
                    started: null,
                    timesUsed: null,
                },
                sort: { direction: 'DESC', field: 'START_DATE' },
            },
        });
    };

    const deleteData = async (row) => {
        console.log('✌️row --->', row);
        showDeleteAlert(
            async () => {
                const { data } = await deleteCoupon({
                    variables: {
                        id: row.id,
                    },
                });

                const updatedRecordsData = recordsData.filter((dataRecord: any) => dataRecord.id !== row.id);
                setRecordsData(updatedRecordsData);
                fetchLowStockList({
                    variables: {
                        channel: 'india-channel',
                        first: PAGE_SIZE,
                        after: null,
                        search: search,
                    },
                });
                Swal.fire('Deleted!', 'Your coupon has been deleted.', 'success');
            },
            () => {
                Swal.fire('Cancelled', 'Your Coupon List is safe :)', 'error');
            }
        );
    };

    return (
        <div>
            <div className="">
                <div className="panel mb-5 flex items-center justify-between gap-5">
                    <div className="flex items-center gap-5">
                        <h5 className="text-lg font-semibold dark:text-white-light">Shipping Zone</h5>
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary  w-full md:mb-0 md:w-auto" onClick={() => window.open('/createZone', '_blank')}>
                            + Create
                        </button>
                    </div>
                </div>
                {/* <div className="mb-5 flex-col justify-end gap-5 md:flex md:flex-row md:items-center">
                    <input type="text" className="form-input mb-3 mr-2 h-[40px] w-[400px] " placeholder="Search..." value={search} onChange={(e) => handleSearchChange(e.target.value)} />
                </div> */}
                {getLoading ? (
                    <CommonLoader />
                ) : (
                    <div className="datatables">
                        <DataTable
                            className="table-hover whitespace-nowrap"
                            records={recordsData}
                            columns={[
                                { accessor: 'name', sortable: true },
                                { accessor: 'price', sortable: true },


                                {
                                    accessor: 'actions',
                                    title: 'Actions',
                                    render: (row: any) => {
                                        return (
                                            <>
                                                <div className=" flex w-max  gap-4">
                                                    <button
                                                        className="flex hover:text-info"
                                                        onClick={() => {
                                                            window.open(`/editZone?id=${row.id}`, '_blank');
                                                        }}
                                                    >
                                                        <IconEdit className="h-4.5 w-4.5" />
                                                    </button>

                                                    {/* <button type="button" className="flex hover:text-danger" onClick={() => deleteData(row)}>
                                                        <IconTrashLines />
                                                    </button> */}
                                                </div>
                                            </>
                                        );
                                    },
                                },
                            ]}
                            highlightOnHover
                            totalRecords={recordsData.length}
                            recordsPerPage={PAGE_SIZE}
                            page={null}
                            onPageChange={(p) => {}}
                            sortStatus={{
                                columnAccessor: 'name',
                                direction: 'asc',
                            }}
                            onSortStatusChange={() => {}}
                            withBorder={true}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => ''}
                        />
                        <div className="mt-5 flex justify-end gap-3">
                            <button disabled={!hasPreviousPage} onClick={handlePreviousPage} className={`btn ${!hasPreviousPage ? 'btn-disabled' : 'btn-primary'}`}>
                                <IconArrowBackward />
                            </button>
                            <button disabled={!hasNextPage} onClick={handleNextPage} className={`btn ${!hasNextPage ? 'btn-disabled' : 'btn-primary'}`}>
                                <IconArrowForward />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const tableFormat = (products) => {
    return products.map((product) => ({
        name: product?.node?.name,
        id: product?.node?.id,
        price: product?.node?.shippingMethods?.length > 0 ? product?.node?.shippingMethods[0]?.channelListings[0]?.price?.amount : 0,
    }));
};

export default PrivateRouter(Coupon);
