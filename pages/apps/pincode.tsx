import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, Fragment, useEffect } from 'react';
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
import { Failure, Success } from '@/utils/functions';
import IconLoader from '@/components/Icon/IconLoader';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconArrowForward from '@/components/Icon/IconArrowForward';
import CommonLoader from '../elements/commonLoader';
import { CREATE_PINCODE, DELETE_PINCODE, PINCODE_LIST, UPDATE_PINCODE } from '@/query/pincode';
import useDebounce from '@/utils/useDebounce';

const Pincode = () => {
    const [addTag, { loading: addLoading }] = useMutation(CREATE_PINCODE);
    const [updateTag, { loading: updateLoading }] = useMutation(UPDATE_PINCODE);
    const [deleteCategory] = useMutation(DELETE_PINCODE);
    const [bulkDelete] = useMutation(DELETE_PINCODE);

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
    const [modal1, setModal1] = useState(false);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalContant, setModalContant] = useState<any>(null);
    const [totalCount, setTotalCount] = useState(0);

    const {
        data: customerData,
        loading: getLoading,
        refetch: categoryListRefetch,
    } = useQuery(PINCODE_LIST, {
        variables: {
            channel: 'india-channel',
            first: PAGE_SIZE,
            after: null,
            filter: {
                code: search !== '' ? [search] : [],
            },
        },
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const {} = useQuery(PINCODE_LIST, {
        variables: {
            channel: 'india-channel',
            first: PAGE_SIZE,
            after: null,
            filter: {
                code: [],
            },
        },
        onCompleted: (data) => {
            setTotalCount(data?.pincodes?.totalCount);
        },
    });

    const { data, refetch: refetch } = useQuery(PINCODE_LIST, {
        variables: {
            channel: 'india-channel',
            first: PAGE_SIZE,
            after: null,
            filter: {
                code: [],
            },
        },
    });

    const [fetchNextPage] = useLazyQuery(PINCODE_LIST, {
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const [fetchPreviousPage] = useLazyQuery(PINCODE_LIST, {
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const debouncedSearchTerm = useDebounce(search, 2000); // Debounce with a 500ms delay

    useEffect(() => {
        if (debouncedSearchTerm) {
            handleSearchChange(debouncedSearchTerm);
        } else {
            refresh();
        }
    }, [debouncedSearchTerm]);

    const commonPagination = (data) => {
        const customers = data.pincodes.edges;
        const pageInfo = data.pincodes?.pageInfo;

        const newData = customers?.map((item: any) => {
            return {
                name: item.node?.name,
                id: item.node?.id,
                code: item.node?.codes,
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
                    code: [search],
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
                    code: [search],
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
                    code: [],
                },
            });
            setTotalCount(data?.pincodes?.totalCount);
            commonPagination(data);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const handleSearchChange = async (e) => {
        const res = await categoryListRefetch({
            variables: {
                channel: 'india-channel',

                filter: {
                    code: [e],
                },
                last: PAGE_SIZE,
                before: startCursor,
            },
        });
        commonPagination(res?.data);
    };

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required('Name is required'),

        pincode: Yup.string()
            .required('Pincode is required')
            .matches(/^(\d{1,10})(,\d{1,10})*$/, 'Only comma-separated numbers are allowed, each up to 10 digits (e.g., 641701,621704)'),
    });

    const SubmittedForm1 = Yup.object().shape({
        name: Yup.string().required('Name is required'),

        pincode: Yup.array()
            .transform((value, originalValue) => {
                // Convert comma-separated string to array if needed
                if (typeof originalValue === 'string') {
                    return originalValue
                        .split(',')
                        .map((item) => item.trim())
                        .filter((item) => item.length > 0); // remove empty entries
                }

                // For array input, trim and filter
                if (Array.isArray(originalValue)) {
                    return originalValue.map((item) => (typeof item === 'string' ? item.trim() : item)).filter((item) => typeof item === 'string' && item.length > 0);
                }

                return value;
            })
            .of(
                Yup.string()
                    .matches(/^\d{1,10}$/, 'Each pincode must be a number with up to 10 digits')
                    .required('Pincode cannot be empty')
            )
            .min(1, 'At least one valid pincode is required')
            .required('Pincode is required'),
    });

    // form submit
    const onSubmit = async (record: any, { resetForm }: any) => {
        let pincode = null;
        if (modalTitle) {
            if (Array.isArray(record?.pincode)) {
                const pincodes = record?.pincode?.map((item) => (typeof item === 'string' ? item.trim() : item)).filter((item) => item && /^\d{1,10}$/.test(item)); // optional: keep only valid ones
                pincode = pincodes;
            } else {
                const cleaned = record?.pincode
                    .split(',') // Split by comma
                    .map((item) => item.trim()) // Trim spaces
                    .filter((item) => item.length > 0);
                pincode = cleaned;
            }
        } else {
            pincode = record?.pincode?.split(',');
        }

        try {
            const variables = {
                input: {
                    name: record.name,
                    codes: pincode,
                },
            };

            const res = await (modalTitle ? updateTag({ variables: { ...variables, id: modalContant.id } }) : addTag({ variables }));
            if (modalTitle) {
                if (res?.data?.pincodeUpdate?.errors?.length > 0) {
                    Failure(res?.data?.pincodeUpdate?.errors[0]?.message);
                    return;
                } else {
                    Success('Pincode updated successfully');
                    refresh();
                    setModal1(false);
                    resetForm();
                }
            } else {
                if (res?.data?.pincodeCreate?.errors?.length > 0) {
                    Failure(res?.data?.pincodeCreate?.errors[0]?.message);
                    return;
                } else {
                    Success('Pincode created successfully');
                    refresh();
                    setModal1(false);
                    resetForm();
                }
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    // category table edit
    const EditCategory = (record: any) => {
        setModal1(true);
        setModalTitle(record);
        setModalContant(record);
    };

    // category table create
    const CreateTags = () => {
        setModal1(true);
        setModalTitle(null);
        setModalContant(null);
    };

    // view categotry
    // const ViewCategory = (record: any) => {
    //     setViewModal(true);
    // };

    // delete Alert Message
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

    const BulkDeleteCategory = async () => {
        showDeleteAlert(
            async () => {
                if (selectedRecords.length === 0) {
                    Swal.fire('Cancelled', 'Please select at least one record!', 'error');
                    return;
                }
                selectedRecords?.map(async (item: any) => {
                    await bulkDelete({ variables: { id: item.id } });
                });
                Swal.fire('Deleted!', 'Your files have been deleted.', 'success');
                refresh();
                setSelectedRecords([]);
            },
            () => {
                Swal.fire('Cancelled', 'Your List is safe :)', 'error');
            }
        );
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
                    <h5 className="text-lg font-semibold dark:text-white-light">Pincodes ({totalCount})</h5>

                    <div className="flex ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input mr-2 w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />

                        <button type="button" className="btn btn-primary" onClick={() => CreateTags()}>
                            + Create
                        </button>
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
                                { accessor: 'name' },
                                { accessor: 'code', render: (row: any) => <div>{row?.code?.join(', ')}</div> },

                                {
                                    accessor: 'actions',
                                    title: 'Actions',
                                    render: (row: any) => (
                                        <>
                                            <Tippy content="Edit">
                                                <button type="button" onClick={() => EditCategory(row)}>
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
            {/* )} */}

            {/* CREATE AND EDIT Tags FORM */}
            <Transition appear show={modal1} as={Fragment}>
                <Dialog as="div" open={modal1} onClose={() => setModal1(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <div className="text-lg font-bold">{modalTitle === null ? 'Add New Pincode' : 'Edit Pincode'}</div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal1(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="mb-5 p-5">
                                        <Formik
                                            initialValues={modalContant === null ? { name: '', pincode: '' } : { name: modalContant?.name, pincode: modalContant?.code }}
                                            validationSchema={modalContant === null ? SubmittedForm : SubmittedForm1}
                                            onSubmit={(values, { resetForm }) => {
                                                onSubmit(values, { resetForm }); // Call the onSubmit function with form values and resetForm method
                                            }}
                                        >
                                            {({ errors, submitCount, touched, setFieldValue, values }: any) => (
                                                <Form className="space-y-5">
                                                    <div className={submitCount ? (errors.name ? 'has-error' : 'has-success') : ''}>
                                                        <label htmlFor="fullName">Name</label>
                                                        <Field name="name" type="text" id="fullName" placeholder="Enter Name" className="form-input" />
                                                        {submitCount ? errors.name ? <div className="mt-1 text-danger">{errors.name}</div> : <div className="mt-1 text-success"></div> : ''}
                                                    </div>

                                                    <div className={submitCount ? (errors.name ? 'has-error' : 'has-success') : ''}>
                                                        <label htmlFor="pincode">Pincode</label>
                                                        <Field name="pincode" type="text" id="pincode" placeholder="Enter Pincode" className="form-input" />
                                                        {/* <div className="text-sm">Minimum 6 digits</div> */}
                                                        {submitCount ? errors.pincode ? <div className="mt-1 text-danger">{errors.pincode}</div> : <div className="mt-1 text-success"></div> : ''}
                                                    </div>

                                                    <button type="submit" className="btn btn-primary !mt-6">
                                                        {addLoading || updateLoading ? <IconLoader /> : 'Submit'}
                                                    </button>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default PrivateRouter(Pincode);
