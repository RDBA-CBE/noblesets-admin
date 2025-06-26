import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, Fragment } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import IconPencil from '@/components/Icon/IconPencil';

import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';

import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import PrivateRouter from '@/components/Layouts/PrivateRouter';
import { Success } from '@/utils/functions';
import IconLoader from '@/components/Icon/IconLoader';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconArrowForward from '@/components/Icon/IconArrowForward';
import CommonLoader from '../../elements/commonLoader';
import DynamicSizeTable from '@/components/Layouts/DynamicTable';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { DELETE_SIZEGUIDE, SIZEGUIDE_LIST } from '@/query/sizeGuide';

const SizeGuide = () => {
    const router = useRouter();

    const [deleteCategory] = useMutation(DELETE_SIZEGUIDE);

    const PAGE_SIZE = 10;

    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const [recordsData, setRecordsData] = useState([]);
    const [startCursor, setStartCursor] = useState(null);
    const [endCursor, setEndCursor] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    const [totalCount, setTotalCount] = useState(0);

    const {
        data: customerData,
        loading: getLoading,
        refetch: categoryListRefetch,
    } = useQuery(SIZEGUIDE_LIST, {
        variables: {
            channel: 'india-channel',
            first: PAGE_SIZE,
            after: null,
            filter: {
                search: search !== '' ? search : '',
            },
        },
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const {} = useQuery(SIZEGUIDE_LIST, {
        variables: {
            channel: 'india-channel',
            first: PAGE_SIZE,
            after: null,
            filter: {
                search: '',
            },
        },
        onCompleted: (data) => {
            setTotalCount(data?.sizeGuids?.totalCount);
        },
    });

    const { data, refetch: refetch } = useQuery(SIZEGUIDE_LIST, {
        variables: {
            channel: 'india-channel',
            first: PAGE_SIZE,
            after: null,
            filter: {
                search: '',
            },
        },
    });

    const [fetchNextPage] = useLazyQuery(SIZEGUIDE_LIST, {
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const [fetchPreviousPage] = useLazyQuery(SIZEGUIDE_LIST, {
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const commonPagination = (data) => {
        const customers = data.sizeGuids.edges;
        const pageInfo = data.sizeGuids?.pageInfo;

        const newData = customers?.map((item: any) => {
            return {
                name: item.node?.name,
                id: item.node?.id,
            };
        });
        setRecordsData(newData);
        setStartCursor(pageInfo?.startCursor || null);
        setEndCursor(pageInfo?.endCursor || null);
        setHasNextPage(pageInfo?.hasNextPage || false);
        setHasPreviousPage(pageInfo?.hasPreviousPage || false);

    };

    const handleNextPage = () => {
        fetchNextPage({
            variables: {
                channel: 'india-channel',
                first: PAGE_SIZE,
                after: endCursor,
                before: null,
                filter: {
                    search: search,
                },
            },
        });
    };

    const handlePreviousPage = () => {
        fetchPreviousPage({
            variables: {
                channel: 'india-channel',
                last: PAGE_SIZE,
                before: startCursor,
                filter: {
                    search: search,
                },
            },
        });
    };
    // Statement Earrings necklaces
    const refresh = async () => {
        try {
            const { data } = await refetch({
                channel: 'india-channel',
                first: PAGE_SIZE,
                after: null,

                filter: {
                    search: '',
                },
            });
            setTotalCount(data?.sizeGuids?.totalCount);
            commonPagination(data);
        } catch (error) {
            console.log('error: ', error);
        }
    };
    const handleSearchChange = async (e) => {
        setSearch(e);
        if (e == '') {
            refresh();
        } else {
            const res = await categoryListRefetch({
                variables: {
                    channel: 'india-channel',

                    filter: {
                        search: e,
                    },
                    last: PAGE_SIZE,
                    before: startCursor,
                },
            });
            commonPagination(res?.data);
        }
    };

    const showDeleteAlert = (onConfirm: () => void, onCancel: () => void) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-primary ltr:mr-3 rtl:ml-3',
                popup: 'sweet-alerts',
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    onConfirm(); // Call the onConfirm function if the user confirms the deletion
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    onCancel(); // Call the onCancel function if the user cancels the deletion
                }
            });
    };

    const DeleteCategory = (record: any) => {
        showDeleteAlert(
            async () => {
                const { data } = await deleteCategory({ variables: { id: record.id } });
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                refresh();
                setSelectedRecords([]);
            },
            () => {
                Swal.fire('Cancelled', 'Your Brand List is safe :)', 'error');
            }
        );
    };

    return (
        <div>
            {/* {getLoading ? (
                <CommonLoader />
            ) : ( */}
            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">Size Guide ({totalCount})</h5>

                    <div className="flex ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input mr-2 w-auto" placeholder="Search..." value={search} onChange={(e) => handleSearchChange(e.target.value)} />

                        <Link href="/apps/sizeGuide/createSizeGuide" target="_blank" className="btn btn-primary">
                            + Create
                        </Link>
                    </div>
                </div>
                {getLoading ? (
                    <CommonLoader />
                ) : (
                    <div className="datatables">
                        <DataTable
                            className="table-hover whitespace-nowrap"
                            records={recordsData}
                            columns={[
                                { accessor: 'name',  },
                                {
                                    accessor: 'actions',
                                    title: 'Actions',
                                    render: (row: any) => (
                                        <>
                                            <Tippy content="Edit">
                                                <button type="button" onClick={() => router.push(`/apps/sizeGuide/editSizeGuide/?id=${row.id}`)}>
                                                    <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                                </button>
                                            </Tippy>
                                            <Tippy content="Delete">
                                                <button type="button" onClick={() => DeleteCategory(row)}>
                                                    <IconTrashLines />
                                                </button>
                                            </Tippy>
                                        </>
                                    ),
                                },
                            ]}
                            highlightOnHover
                            totalRecords={recordsData?.length}
                            recordsPerPage={PAGE_SIZE}
                            minHeight={200}
                            page={null}
                            onPageChange={(p) => {}}
                            withBorder={true}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            selectedRecords={selectedRecords}
                            onSelectedRecordsChange={(val) => {
                                setSelectedRecords(val);
                            }}
                        />
                    </div>
                )}

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

export default PrivateRouter(SizeGuide);
