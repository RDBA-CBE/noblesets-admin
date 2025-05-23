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
import { BRAND_LIST, CREATE_BRAND, UPDATE_BRAND, DELETE_BRAND } from '@/query/brand';
import PrivateRouter from '@/components/Layouts/PrivateRouter';
import { addNewMediaFile, Failure, getFileType, getImageDimensions, resizeImage, resizingImage, Success, useSetState } from '@/utils/functions';
import IconLoader from '@/components/Icon/IconLoader';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconArrowForward from '@/components/Icon/IconArrowForward';
import CommonLoader from '../elements/commonLoader';
import { ADD_NEW_MEDIA_IMAGE, MEDIA_PAGINATION } from '@/query/product';

const Brands = () => {
    const [addTag, { loading: addLoading }] = useMutation(CREATE_BRAND);
    const [updateTag, { loading: updateLoading }] = useMutation(UPDATE_BRAND);
    const [deleteCategory] = useMutation(DELETE_BRAND);
    const [bulkDelete] = useMutation(DELETE_BRAND);

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
    const [state, setState] = useSetState({
        imagePreview:"",
    });

    const [addNewImages, { loading: addNewImageLoading }] = useMutation(ADD_NEW_MEDIA_IMAGE);

    const { refetch: mediaRefetch } = useQuery(MEDIA_PAGINATION);

    const PAGE_LIMIT = 10;

    const {
        data: customerData,
        loading: getLoading,
        refetch: categoryListRefetch,
    } = useQuery(BRAND_LIST, {
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

    const {} = useQuery(BRAND_LIST, {
        variables: {
            channel: 'india-channel',
            first: PAGE_SIZE,
            after: null,
            filter: {
                search: '',
            },
        },
        onCompleted: (data) => {
            setTotalCount(data?.brands?.totalCount);
        },
    });

    const { data, refetch: refetch } = useQuery(BRAND_LIST, {
        variables: {
            channel: 'india-channel',
            first: PAGE_SIZE,
            after: null,
            filter: {
                search: '',
            },
        },
    });

    const [fetchNextPage] = useLazyQuery(BRAND_LIST, {
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const [fetchPreviousPage] = useLazyQuery(BRAND_LIST, {
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const commonPagination = (data) => {
        const customers = data.brands.edges;
        const pageInfo = data.brands?.pageInfo;

        const newData = customers?.map((item: any) => {
            return {
                name: item.node?.name,
                id: item.node?.id,
                logo: item.node?.logo,
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
            setTotalCount(data?.brands?.totalCount);
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
            setTotalCount(res?.data?.brands?.totalCount);

            commonPagination(res?.data);
        }
    };

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required('Please fill the Name'),
        image: Yup.string().required('Image is required'),
    });

    const generateUniqueFilenames = async (filename) => {
        let uniqueFilename = filename;
        let counter = 0;
        let fileExists = true;

        while (fileExists) {
            const res = await mediaRefetch({
                first: PAGE_LIMIT,
                after: null,
                fileType: '',
                month: null,
                year: null,
                name: uniqueFilename,
            });

            if (res?.data?.files?.edges?.length > 0) {
                counter += 1;
                const fileParts = filename.split('.');
                const extension = fileParts.pop();
                uniqueFilename = `${fileParts.join('.')}-${counter}.${extension}`;
            } else {
                fileExists = false;
            }
        }

        return uniqueFilename;
    };

    const addNewImage = async (files) => {
        const isImage = files.type.startsWith('image/');
        if (isImage) {
            if (files.size > 300 * 1024) {
                files = await resizingImage(files);
                files = await resizeImage(files, 1160, 1340);
            } else {
                files = await resizeImage(files, 1160, 1340);
            }
            const { width, height } = await getImageDimensions(files);
        }

        const unique = await generateUniqueFilenames(files.name);
        const result = await addNewMediaFile(files, unique);
        const fileType = await getFileType(result);
        const body = {
            fileUrl: result,
            title: '',
            alt: '',
            description: '',
            caption: '',
            fileType: fileType,
        };
        const response = await addNewImages({
            variables: {
                input: body,
            },
        });

        const bodys = {
            node: {
                fileUrl: response.data?.fileCreate?.file?.fileUrl,
            },
        };
        console.log('✌️bodys --->', bodys);
        return response.data?.fileCreate?.file?.fileUrl;
    };

    // form submit
    const onSubmit = async () => {
        try {

            const values: any = {
                name: state.name, 
                image: state.imagePreview,
            };

            await SubmittedForm.validate(values, { abortEarly: false });

            const body: any = {};

            if (state.imgFile) {
                let sizeimg = await addNewImage(state.imgFile);
                body.sizeimg = encodeURI(sizeimg);
            }
            const variables: any = {
                input: {
                    name: state.name,
                    // logo: body.sizeimg,
                },
            };
            if (state.imgFile) {
                variables.input.logo = body.sizeimg;
            }

            const res = await (modalTitle ? updateTag({ variables: { ...variables, id: modalContant.id } }) : addTag({ variables }));
            if (modalTitle) {
                if (res?.data?.brandUpdate?.errors?.length > 0) {
                    Failure(res?.data?.brandUpdate?.errors[0]?.message);
                    return;
                } else {
                    Success('Brand updated successfully');
                    refresh();
                    setModal1(false);
                    setState({
                        name: '',
                        imagePreview: "",
                        imgFile: null,
                        errors: null,
                    });
                    // resetForm();
                }
            } else {
                if (res?.data?.brandCreate?.errors?.length > 0) {
                    Failure(res?.data?.brandCreate?.errors[0]?.message);
                    return;
                } else {
                    Success('Brand created successfully');
                    refresh();
                    setModal1(false);
                    setState({
                        name: '',
                        imgFile: null,
                        errors: null,
                        imagePreview: "",
                    });
                    // resetForm();
                }
            }
        } catch (err) {
            if (err.inner) {
                const newErrors = {};
                err.inner.forEach((e) => {
                    newErrors[e.path] = e.message;
                });
                setState({ errors: newErrors });
            }
            console.log('error: ', err);
        }
    };

    // category table edit
    const EditCategory = (record: any) => {
        console.log('✌️record --->', record);
        setModal1(true);
        setModalTitle(record);
        setModalContant(record);
        setState({ imagePreview: record.logo, name: record.name });
    };

    // category table create
    const CreateTags = () => {
        setModal1(true);
        setModalTitle(null);
        setModalContant(null);
    };

    // delete Alert Message
    const showDeleteAlert = (onConfirm: () => void, onCancel: () => void) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-secondary',
                cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
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

    const uploadFiles = async (e) => {
        let file = e.target.files[0];
        const isImage = file.type.startsWith('image/');
        if (!isImage) return;

        if (file.size > 300 * 1024) {
            file = await resizingImage(file);
            file = await resizeImage(file, 1160, 1340);
        } else {
            file = await resizeImage(file, 1160, 1340);
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setState({ imagePreview: reader.result });
        };
        reader.readAsDataURL(file);
        setState({ imgFile: file });
    };

    return (
        <div>
            {/* {getLoading ? (
                <CommonLoader />
            ) : ( */}
            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">Brands ({totalCount})</h5>

                    <div className="flex ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input mr-2 w-auto" placeholder="Search..." value={search} onChange={(e) => handleSearchChange(e.target.value)} />
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
                                {
                                    accessor: 'logo',
                                    title: 'Logo',
                                    render: (row: any) => (
                                        <div className="flex items-center gap-2">
                                            <img src={row?.logo} alt="Logo" className="h-10 w-10 rounded-full" />
                                        </div>
                                    ),
                                },
                                { accessor: 'name', sortable: true },
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
                <Dialog
                    as="div"
                    open={modal1}
                    onClose={() => {
                        setModal1(false);
                        setState({
                            name: '',
                            imagePreview: "",
                            imgFile: null,
                            errors: null,
                        });
                    }}
                >
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
                                        <div className="text-lg font-bold">{modalTitle === null ? 'Create Brand' : 'Edit Brand'}</div>
                                        <button
                                            type="button"
                                            className="text-white-dark hover:text-dark"
                                            onClick={() => {
                                                setModal1(false);
                                                setState({
                                                    name: '',
                                                    imagePreview: "",
                                                    imgFile: null,
                                                    errors: null,
                                                });
                                            }}
                                        >
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="mb-5 p-5">
                                        <div>
                                            <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                                                Brand Image
                                            </label>
                                        </div>

                                        <div className="active border-1 border p-4 pt-5">
                                            {!state.imagePreview ? (
                                                <div className="flex h-[100px] items-center justify-center">
                                                    <div className="w-1/2 text-center">
                                                        <h3 className="mb-2 text-xl font-semibold">Upload Image</h3>
                                                        <p className="mb-2 text-sm">or</p>
                                                        <input type="file" accept="image/*" className="mb-2 ml-32" onChange={uploadFiles} />
                                                        <p className="mb-2 text-sm">Maximum upload file size: 30 MB.</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4">
                                                    <img src={state.imagePreview} alt="Uploaded" className="max-h-[400px] rounded shadow" />
                                                    <div className="flex gap-3">
                                                        <button type="button" onClick={() => document.getElementById('image-upload').click()} className="rounded bg-blue-600 px-4 py-2 text-white">
                                                            Replace Image
                                                        </button>
                                                    </div>
                                                    <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={uploadFiles} />
                                                </div>
                                            )}
                                        </div>
                                        {state.errors?.image && <div className="mt-1 text-danger">{state.errors?.image}</div>}

                                        <div>
                                            <label htmlFor="fullName">Name</label>
                                            <input id="fullName" type="text" value={state.name} onChange={(e) => setState({ name: e.target.value })} placeholder="Enter Name" className="form-input" />
                                            {state.errors?.name && <div className="mt-1 text-danger">{state.errors?.name}</div>}
                                        </div>

                                        <button type="button" className="btn btn-primary !mt-6" onClick={onSubmit}>
                                            {addLoading || updateLoading ? <IconLoader /> : 'Submit'}
                                        </button>
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

export default PrivateRouter(Brands);
