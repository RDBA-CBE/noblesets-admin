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
import { Failure, FRONTEND_URL, showDeleteAlert, Success } from '@/utils/functions';
import PrivateRouter from '@/components/Layouts/PrivateRouter';
import moment from 'moment';
import CommonLoader from '../elements/commonLoader';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconArrowForward from '@/components/Icon/IconArrowForward';
import { commonBody } from '@/utils/constant';
import IconLoader from '@/components/Icon/IconLoader';
import { CREATE_STAFF, DELETE_STAFF, STAFF_LIST, UPDATE_STAFF } from '@/query/staff';

const staffManager = () => {
    const router = useRouter();
    const PAGE_SIZE = 20;

    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [addTag, { loading: addLoading }] = useMutation(CREATE_STAFF);
    const [updateTag, { loading: updateLoading }] = useMutation(UPDATE_STAFF);
    const [recordsData, setRecordsData] = useState([]);
    const [startCursor, setStartCursor] = useState(null);
    const [endCursor, setEndCursor] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [total, setTotal] = useState(null);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [modal1, setModal1] = useState(false);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalContant, setModalContant] = useState<any>(null);

    const [search, setSearch] = useState('');

    const dispatch = useDispatch();

    const [removeCustomer, { loading: removeloading }] = useMutation(DELETE_STAFF);

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
    } = useQuery(STAFF_LIST, {
        variables: {
            first: PAGE_SIZE,
            after: null,
            filter: {
                search: search,
            },
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

    const {} = useQuery(STAFF_LIST, {
        variables: {
            first: PAGE_SIZE,
            after: null,
            filter: {
                search: '',
            },
            sort: {
                direction: 'DESC',
                field: 'CREATED_AT',
            },

            PERMISSION_MANAGE_ORDERS: true,
        },
        onCompleted: (data) => {
            setTotal(data?.staffUsers.totalCount - 1);
        },
    });

    const [fetchNextPage] = useLazyQuery(STAFF_LIST, {
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const [fetchPreviousPage] = useLazyQuery(STAFF_LIST, {
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const commonPagination = (data) => {
        const customers = data?.staffUsers?.edges;
        const exceptAdmin=customers?.filter((item)=>item?.node?.isSuperUser == false )
        const pageInfo = data?.staffUsers?.pageInfo;
        setRecordsData(
            exceptAdmin?.map((item) => ({
                ...item.node,
                name: `${item.node.firstName} ${item.node.lastName}`,
                email: item.node.email,
                dateJoined: moment(item.node.dateJoined).format('YYYY-MM-DD'),
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
                filter: {
                    search: search,
                },
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
                filter: {
                    search: search,
                },
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
                    filter: {
                        search: '',
                    },
                    sort: {
                        direction: 'DESC',
                        field: 'CREATED_AT',
                    },

                    PERMISSION_MANAGE_ORDERS: true,
                },
            });
            setTotal(data?.staffUsers.totalCount - 1);

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
                filter: {
                    search: search,
                },
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
                const ids = selectedRecords?.map(
                    async (item) =>
                        await removeCustomer({
                            variables: {
                                id: item.id,
                            },
                        })
                );
                const updatedRecordsData = recordsData.filter((dataRecord: any) => !ids.includes(dataRecord.id));
                setRecordsData(updatedRecordsData);
                // setTotal(total - ids?.length);
                Swal.fire('Deleted!', 'Your staff user has been deleted.', 'success');
                refresh();
            },
            () => {
                Swal.fire('Cancelled', 'Your staff user List is safe :)', 'error');
            }
        );
    };

    const DeleteProduct = (row: any) => {
        showDeleteAlert(
            async () => {
                const res = await removeCustomer({
                    variables: {
                        id: row.id,
                    },
                });
                const updatedRecordsData = recordsData.filter((dataRecord: any) => dataRecord.id !== row.id);
                setRecordsData(updatedRecordsData);
                // setTotal(total - 1);
                Swal.fire('Deleted!', 'Your Staff has been deleted.', 'success');
                refresh();
            },
            () => {
                Swal.fire('Cancelled', 'Your Staff List is safe :)', 'error');
            }
        );
    };

    const SubmittedForm = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
    });

    const onSubmit = async (record: any, { resetForm }: any) => {
        try {
            const add = {
                input: {
                    email: record.email,
                    firstName: record.firstName,
                    lastName: record.lastName,
                    isActive: true,
                    addGroups: ['R3JvdXA6MQ=='], // ADMIN PERMISSION ID
                    redirectUrl: `${FRONTEND_URL}/password_reset`,
                },
            };

            const update = {
                id: modalContant?.id,
                input: {
                    email: record.email,
                    firstName: record.firstName,
                    lastName: record.lastName,
                    isActive: true,
                    addGroups: ['R3JvdXA6MQ=='], // ADMIN PERMISSION ID
                },
            };

            const res = await (modalTitle ? updateTag({ variables: update }) : addTag({ variables: add }));
            if (modalTitle) {
                if (res?.data?.staffUpdate?.errors?.length > 0) {
                    Failure(res?.data?.staffUpdate?.errors[0]?.message);
                    return;
                } else {
                    Success('User updated successfully');
                    refresh();
                    setModal1(false);
                    resetForm();
                    setModalTitle(null)
                    setModalContant(null)
                }
            } else {
                if (res?.data?.staffCreate?.errors?.length > 0) {
                    Failure(res?.data?.staffCreate?.errors[0]?.message);
                    return;
                } else {
                    Success('User created successfully');
                    refresh();
                    setModal1(false);
                    resetForm();
                    setModalTitle(null)
                    setModalContant(null)
                }
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const EditCategory = (record: any) => {
        setModal1(true);
        setModalTitle(record);
        setModalContant(record);
    };

    return (
        <div>
            <div className="panel mt-6">
                <div className="mb-10 flex flex-col gap-5 lg:mb-5 lg:flex-row lg:items-center">
                    <div className="flex items-center gap-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">Staff Users {total !== null && `(${total})`}</h5>
                        {/* <button type="button" className="btn btn-outline-primary">
                            Import
                        </button>
                        <button type="button" className="btn btn-outline-primary">
                            Export
                        </button> */}
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
                        <button type="button" className="btn btn-primary  w-full md:mb-0 md:w-auto" onClick={() => {
                             setModalTitle(null);
                             setModalContant(null);
                            setModal1(true)}}>
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
                                    accessor: 'name',
                                  sortable: false 
                                    
                                },

                                { accessor: 'email'},
                                { accessor: 'dateJoined',  title: 'Registered Date' },

                                {
                                    accessor: 'actions', // You can use any accessor name you want
                                    title: 'Actions',
                                    // Render method for custom column
                                    render: (row: any) => (
                                        <>
                                            <div className="mx-auto flex w-max items-center gap-4">
                                                <button className="flex hover:text-info" onClick={() => EditCategory(row)}>
                                                    <IconEdit className="h-4.5 w-4.5" />
                                                </button>

                                                <button type="button" className="flex hover:text-danger" onClick={() => DeleteProduct(row)}>
                                                    <IconTrashLines />
                                                </button>
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
                                columnAccessor: 'names',
                                direction: 'asc',
                            }}
                            onSortStatusChange={() => {}}
                            withBorder={true}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => ''}
                            // selectedRecords={selectedRecords}
                            // onSelectedRecordsChange={(selectedRecords) => {
                            //     setSelectedRecords(selectedRecords);
                            // }}
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
                                        <div className="text-lg font-bold">{modalTitle === null ? 'Add New Staff User' : 'Edit Staff User'}</div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal1(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="mb-5 p-5">
                                        <Formik
                                            initialValues={
                                                modalContant === null
                                                    ? { email: '', firstName: '', lastName: '' }
                                                    : { email: modalContant?.email, firstName: modalContant?.firstName, lastName: modalContant?.lastName }
                                            }
                                            validationSchema={SubmittedForm}
                                            onSubmit={(values, { resetForm }) => {
                                                onSubmit(values, { resetForm }); // Call the onSubmit function with form values and resetForm method
                                            }}
                                        >
                                            {({ errors, submitCount, touched, setFieldValue, values }: any) => (
                                                <Form className="space-y-5">
                                                    <div className={submitCount ? (errors.name ? 'has-error' : 'has-success') : ''}>
                                                        <label htmlFor="firstName">First Name</label>
                                                        <Field name="firstName" type="text" id="fullName" placeholder="Enter Name" className="form-input" />
                                                        {submitCount ? errors.firstName ? <div className="mt-1 text-danger">{errors.firstName}</div> : <div className="mt-1 text-success"></div> : ''}
                                                    </div>

                                                    <div className={submitCount ? (errors.name ? 'has-error' : 'has-success') : ''}>
                                                        <label htmlFor="lastName">Last Name</label>
                                                        <Field name="lastName" type="text" id="fullName" placeholder="Enter Name" className="form-input" />
                                                        {submitCount ? errors.lastName ? <div className="mt-1 text-danger">{errors.lastName}</div> : <div className="mt-1 text-success"></div> : ''}
                                                    </div>

                                                    <div className={submitCount ? (errors.name ? 'has-error' : 'has-success') : ''}>
                                                        <label htmlFor="email">Email</label>
                                                        <Field name="email" type="text" id="email" placeholder="Enter email" className="form-input" />

                                                        {submitCount ? errors.email ? <div className="mt-1 text-danger">{errors.email}</div> : <div className="mt-1 text-success"></div> : ''}
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

export default PrivateRouter(staffManager);
