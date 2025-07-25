import IconX from '@/components/Icon/IconX';
import {
    Success,
    accessKeyId,
    addNewFile,
    addNewMediaFile,
    deleteImagesFromS3,
    docFilter,
    fetchImagesFromS3WithPagination,
    generatePresignedPost,
    generatePresignedVideoPost,
    generateUniqueFilename,
    getFileNameFromUrl,
    getFileType,
    getImageDimensions,
    getImageSizeInKB,
    getKey,
    getMonthNumber,
    imageFilter,
    months,
    objIsEmpty,
    resizeImage,
    resizingImage,
    secretAccessKey,
    separateFiles,
    showDeleteAlert,
    useSetState,
    videoFilter,
} from '@/utils/functions';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import CommonLoader from './elements/commonLoader';
import pdf from '../public/assets/images/pdf.png';
import docs from '../public/assets/images/docs.jpg';
import AWS from 'aws-sdk';
import Image from 'next/image';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { ADD_NEW_MEDIA_IMAGE, UPDATE_MEDIA_IMAGE, DELETE_MEDIA_IMAGE, GET_MEDIA_IMAGE, MEDIA_PAGINATION } from '@/query/product';
import { Description } from '@headlessui/react/dist/components/description/description';
import IconLoader from '@/components/Icon/IconLoader';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconArrowForward from '@/components/Icon/IconArrowForward';
import PrivateRouter from '@/components/Layouts/PrivateRouter';

const Media = () => {
    const [state, setState] = useSetState({
        tab: 1,
        imageList: [],
        selectImg: null,
        date: 'all',
        selectedImages: [],
        copied: false,
        longPress: false,
        mediaType: 'all',
        loading: false,
        alt: '',
        title: '',
        caption: '',
        description: '',
        mediaData: null,
        continuationToken: '',
        isTruncated: false,
        endCursor: false,
        startCursor: false,
        previousPage: '',
        hasNextPage: '',
        selectedMonthNumber: null,
        search: '',
    });

    const longPressTimeout = useRef(null);
    const PAGE_LIMIT = 10;
    const PAGE_SIZE = 24;

    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const [addNewImages, { loading: addNewImageLoading }] = useMutation(ADD_NEW_MEDIA_IMAGE);
    const [updateImages, { loading: mediaUpdateLoading }] = useMutation(UPDATE_MEDIA_IMAGE);
    const [deleteImages] = useMutation(DELETE_MEDIA_IMAGE);
    const { data, refetch: getListRefetch, loading: loading } = useQuery(GET_MEDIA_IMAGE);

    const { refetch: mediaRefetch, loading: listLoading } = useQuery(MEDIA_PAGINATION);

    const {
        error,
        data: customerData,
        loading: getLoading,
    } = useQuery(MEDIA_PAGINATION, {
        variables: {
            first: PAGE_SIZE,
            after: null,
            fileType: state.mediaType == 'all' ? '' : state.mediaType,
            month: state.selectedMonthNumber,
            year: 2025,
            name: state.search,
        },
        onCompleted: (data) => {
            console.log('data: ', data);
            commonPagination(data);
        },
    });

    const handleNextPage = () => {
        fetchNextPage({
            variables: {
                first: PAGE_SIZE,
                after: state.endCursor,
                before: null,
                fileType: state.mediaType == 'all' ? '' : state.mediaType,
                month: state.selectedMonthNumber,
                year: 2025,
                name: state.search,
            },
        });
    };

    const handlePreviousPage = () => {
        fetchPreviousPage({
            variables: {
                last: PAGE_SIZE,
                before: state.startCursor,
                fileType: state.mediaType == 'all' ? '' : state.mediaType,
                month: state.selectedMonthNumber,
                year: 2025,
                name: state.search,
            },
        });
    };

    const [fetchNextPage] = useLazyQuery(MEDIA_PAGINATION, {
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const [fetchPreviousPage] = useLazyQuery(MEDIA_PAGINATION, {
        onCompleted: (data) => {
            commonPagination(data);
        },
    });

    const commonPagination = (data) => {
        setState({
            imageList: data.files.edges,
            startCursor: data.files.pageInfo.startCursor,
            endCursor: data.files.pageInfo.endCursor,
            hasNextPage: data.files.pageInfo.hasNextPage,
            previousPage: data.files.pageInfo.hasPreviousPage,
        });
    };

    useEffect(() => {
        if (state.mediaType == 'all') {
            refresh();
        } else {
            filterByType();
        }
    }, [state.mediaType]);

    const refresh = async () => {
        try {
            const res = await mediaRefetch({
                first: PAGE_SIZE,
                after: null,
                fileType: '',
                month: null,
                year: null,
                name: '',
            });

            commonPagination(res.data);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const handleFileChange = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        try {
            const newFiles = Array.from(files);
            console.log('✌️newFiles --->', newFiles);
            setUploadedFiles((prev) => [...prev, ...newFiles]);

            // Upload logic (replace with your actual upload function)
            await Promise.all(newFiles.map((file) => addNewImage(file)));
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

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
        // let files = e.target.files[0];
        const isImage = files.type.startsWith('image/');
        if (isImage) {
            if (files.size > 300 * 1024) {
                files = await resizingImage(files);
                files = await resizeImage(files, 700, 1050);
            } else {
                files = await resizeImage(files, 700, 1050);
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
        handleClickImage(bodys);

        const res = await mediaRefetch({
            first: PAGE_SIZE,
            after: null,
            fileType: '',
            month: null,
            year: null,
            name: '',
        });

        commonPagination(res.data);
        setState({ tab: 1 });
        Success('File added successfully');
        setState({ loading: false });
    };

    const filterByType = async () => {
        fetchNextPage(commonInput(null, state.mediaType, state.selectedMonthNumber, state.search));
    };

    const searchMediaByName = async (e) => {
        setState({ search: e });
        try {
            if (e !== null && e !== '' && e !== undefined) {
                fetchNextPage(commonInput(null, state.mediaType, state.selectedMonthNumber, e));
            } else {
                fetchNextPage(commonInput(null, state.mediaType, state.selectedMonthNumber, ''));
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const commonInput = (after, fileType, month, name) => {
        const input = {
            variables: {
                first: PAGE_SIZE,
                after,
                fileType: fileType == 'all' ? '' : fileType,
                month,
                year: 2025,
                name,
            },
        };
        return input;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(state.selectImg).then(() => {
            setState({ copied: true });
            setTimeout(() => setState({ copied: false }), 2000);
        });
    };
    const handleImageSelect = (item) => {
        setState((prevState) => ({
            ...prevState,
            selectedImages: prevState.selectedImages.includes(item) ? prevState.selectedImages.filter((image) => image !== item) : [...prevState.selectedImages, item],
        }));
    };

    const handleMouseDown = (item) => {
        longPressTimeout.current = setTimeout(() => {
            setState({ longPress: true });

            handleImageSelect(item);
        }, 500);
    };

    const handleMouseUp = () => {
        clearTimeout(longPressTimeout.current);
        setState({ longPress: false });
    };

    const handleMouseLeave = () => {
        clearTimeout(longPressTimeout.current);
        setState({ longPress: false });
    };

    const multiImageDelete = async () => {
        showDeleteAlert(deleteImage, () => {
            Swal.fire('Cancelled', 'Your Image List is safe :)', 'error');
        });
    };

    const deleteImage = async () => {
        try {
            const key = getFileNameFromUrl(state.selectImg);
            await deleteImagesFromS3(key);
            await deleteImages({ variables: { file_url: state.selectImg } });
            const res = await mediaRefetch({
                first: PAGE_SIZE,
                after: null,
                fileType: '',
                month: null,
                year: null,
                name: '',
            });

            commonPagination(res.data);
            setState({ selectImg: null });
            Swal.fire('Deleted!', 'Your files have been deleted.', 'success');
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const filterMediaByMonth = async (value: any) => {
        setState({ date: value });
        const res = getMonthNumber(value);
        setState({ selectedMonthNumber: res ? res : null });

        fetchNextPage({
            variables: {
                first: PAGE_SIZE,
                after: null,
                fileType: state.mediaType == 'all' ? '' : state.mediaType,
                month: value == 'all' ? null : res,
                year: 2025,
                name: '',
            },
        });
    };

    const handleClickImage = async (item) => {
        const res = await getListRefetch({
            fileurl: item.node.fileUrl,
        });
        const result = res.data.fileByFileurl;
        setState({
            selectImg: result?.fileUrl,
            alt: result?.alt,
            title: result?.title,
            caption: result?.caption,
            description: result?.description,
            mediaData: { size: `${parseFloat(result?.size)?.toFixed(2)} KB`, lastModified: item.updatedAt },
        });
    };

    const updateMetaData = async () => {
        try {
            const fileType = await getFileType(state.selectImg);
            const res = await updateImages({
                variables: {
                    file_url: state.selectImg,
                    input: {
                        fileUrl: state.selectImg,
                        fileType: fileType,
                        alt: state.alt,
                        description: state.description,
                        caption: state.caption,
                        title: state.title,
                    },
                },
            });
            Success('File updated successfully');
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };

    const handleSingleClick = (item: any) => {
        if (state.longPressTimer) {
            clearTimeout(state.longPressTimer);
            setState((prev) => ({ ...prev, longPressTimer: null }));
            return;
        }

        // if (state.isMultiSelectMode) {
        //   handleMultiSelect(item);
        // } else {
        // Your existing single selection logic
        handleClickImage(item);
        // }
    };

    // Handler for long press (enable multi-select)
    const handleLongPressStart = (item: any) => {
        const timer = setTimeout(() => {
            setState((prev) => ({
                ...prev,
                isMultiSelectMode: true,
                selectedImages: [item], // Start with this item selected
                longPressTimer: null,
            }));
        }, 500); // 500ms delay for long press

        setState((prev) => ({ ...prev, longPressTimer: timer }));
    };

    const handleLongPressEnd = () => {
        if (state.longPressTimer) {
            clearTimeout(state.longPressTimer);
            setState((prev) => ({ ...prev, longPressTimer: null }));
        }
    };

    return (
        <div className=" ">
            <div className="panel mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">Media</h5>
            </div>
            <div className="panel   w-full overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                <div className="m-5">
                    <div className="flex gap-5 ">
                        <button
                            onClick={() => {
                                setState({ tab: 0, search: '', date: 'all', mediaType: 'all' });
                                // getMediaImage();
                            }}
                            className={`${state.tab == 0 ? 'btn btn-primary' : ''}
                                                    -mb-[1px] flex items-center rounded p-3.5 py-2 text-lg before:inline-block`}
                        >
                            Upload Files
                        </button>
                        <button
                            onClick={() => {
                                setState({ tab: 1, search: '', date: 'all', mediaType: 'all' });

                                // getMediaImage();
                            }}
                            className={`${state.tab == 1 ? 'btn btn-primary' : ''}
                                                    -mb-[1px] flex items-center rounded p-3.5 py-2 text-lg before:inline-block`}
                        >
                            Media Library
                        </button>
                    </div>

                    {state.tab == 0 ? (
                        addNewImageLoading ? (
                            <CommonLoader />
                        ) : (
                            <div
                                className={`active  pt-5 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className="flex h-[500px] items-center justify-center">
                                    <div className={`w-1/2 text-center`}>
                                        <h3 className="mb-2 text-xl font-semibold">Drag and Drop File</h3>
                                        <p className="mb-2 text-sm ">or</p>
                                        <input type="file" multiple className="mb-2 ml-32" onChange={(e) => handleFileChange(e.target.files)} />

                                        <p className="mb-2 text-sm">Maximum upload file size: 30 MB.</p>
                                    </div>
                                </div>
                            </div>
                        )
                    ) : (
                        <>
                            <div className="grid grid-cols-12 pt-5">
                                <div className="col-span-9  overflow-y-scroll border-r border-gray-200 pr-5">
                                    <div className="flex gap-4">
                                        <div>
                                            <div>Filter by type</div>
                                            <div className="flex justify-between gap-3 pt-3">
                                                <div className="flex gap-3">
                                                    {/* <select className="form-select w-40 flex-1"> */}
                                                    <select className="form-select w-40 flex-1  xl:w-60" value={state.mediaType} onChange={(e) => setState({ mediaType: e.target.value })}>
                                                        <option value="all">All Data</option>
                                                        <option value="Image">Images</option>
                                                        <option value="Video">Videos</option>
                                                        <option value="Doc">Docs</option>

                                                        {/* <option value="July/2025">July 2025</option>
                                                                            <option value="August/2025">August 2025</option> */}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div>Filter by month</div>

                                            <div className="flex justify-between gap-3 pt-3">
                                                <div className="flex gap-3">
                                                    <select
                                                        className="form-select w-40 flex-1  xl:w-60"
                                                        value={state.date}
                                                        onChange={(e) => {
                                                            filterMediaByMonth(e.target.value);
                                                        }}
                                                    >
                                                        <option value="all">All Data</option>
                                                        {months.map((month, index) => (
                                                            <option key={month} value={`${month}/2025`}>{`${month} 2025`}</option>
                                                        ))}
                                                        {/* <option value="June/2025">June 2025</option>
                                                        <option value="July/2025">July 2025</option>
                                                        <option value="August/2025">August 2025</option> */}
                                                    </select>
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        className="form-input mr-2  w-40 xl:w-60  "
                                                        placeholder="Search..."
                                                        value={state.search}
                                                        onChange={(e) => searchMediaByName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className=" ">
                                        {getLoading || loading ? (
                                            <CommonLoader />
                                        ) : (
                                            <div className="grid grid-cols-12 pt-5 ">
                                                {state.imageList?.length > 0 ? (
                                                    state.imageList?.map((item) => {
                                                        return (
                                                            <div
                                                                key={item.node?.fileUrl}
                                                                className={`col-span-2  overflow-hidden p-2 ${
                                                                    state.selectedImages.some((selected) => selected.node?.fileUrl === item.node?.fileUrl) ? 'border-4 border-blue-500' : ''
                                                                }`}
                                                                onClick={() => handleSingleClick(item)}
                                                                onTouchStart={() => handleLongPressStart(item)}
                                                                onTouchEnd={handleLongPressEnd}
                                                                onMouseDown={() => handleLongPressStart(item)}
                                                                onMouseUp={handleLongPressEnd}
                                                                onMouseLeave={handleLongPressEnd}
                                                            >
                                                                {item?.node?.fileUrl?.endsWith('.mp4') ? (
                                                                    <video controls src={item.node?.fileUrl} className="h-full w-full object-cover">
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                ) : item?.node?.fileUrl?.endsWith('.pdf') ? (
                                                                    <Image src={pdf} alt="Loading..." />
                                                                ) : item?.node?.fileUrl?.endsWith('.doc') ? (
                                                                    <Image src={docs} alt="Loading..." />
                                                                ) : (
                                                                    <img src={item.node?.fileUrl} alt="" className="h-full w-full" />
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="col-span-6 flex h-64 items-center justify-center">No Data Found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-5 flex justify-end gap-3">
                                        <button disabled={!state.previousPage} onClick={handlePreviousPage} className={`btn ${!state.previousPage ? 'btn-disabled' : 'btn-primary'}`}>
                                            <IconArrowBackward />
                                        </button>
                                        <button disabled={!state.hasNextPage} onClick={handleNextPage} className={`btn ${!state.hasNextPage ? 'btn-disabled' : 'btn-primary'}`}>
                                            <IconArrowForward />
                                        </button>
                                    </div>
                                </div>
                                {state.selectImg && (
                                    <div className="col-span-3  pl-5">
                                        {/* <div className="border-b border-gray-200 pb-5"> */}
                                        <div className="">
                                            <div>
                                                <p className="mb-2 text-lg font-semibold">ATTACHMENT DETAILS</p>
                                            </div>
                                            <div className="">
                                                {state.selectImg?.endsWith('.mp4') ? (
                                                    <video controls src={state.selectImg} className="">
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : state.selectImg?.endsWith('.pdf') ? (
                                                    <Image src={pdf} alt="Loading..." />
                                                ) : state.selectImg?.endsWith('.doc') ? (
                                                    <Image src={docs} alt="Loading..." />
                                                ) : (
                                                    <img src={state.selectImg} alt="" className="" />
                                                )}
                                                <img src={state.selectImg?.url} alt="" className="" />
                                            </div>
                                            <p className="mt-2 font-semibold">{getKey(state.selectImg)}</p>

                                            <p className="text-sm">{moment(state?.mediaData?.lastModified).format('DD-MM-YYYY')}</p>
                                            <p className="text-sm">{state?.mediaData?.size}</p>

                                            <a href="#" className="text-danger underline" onClick={() => multiImageDelete()}>
                                                Delete permanently
                                            </a>
                                        </div>
                                        <div className="pr-5">
                                            <div className="mt-5">
                                                <label className="mb-2">Alt Text</label>
                                                <textarea className="form-input" placeholder="Enter Alt Text" value={state.alt} onChange={(e) => setState({ alt: e.target.value })}></textarea>
                                                <span>
                                                    <a href="#" className="text-primary underline">
                                                        Learn how to describe the purpose of the image
                                                    </a>
                                                    . Leave empty if the image is purely decorative.
                                                </span>
                                            </div>
                                            <div className="mt-5">
                                                <label className="mb-2">Title</label>
                                                <input type="text" value={state.title} onChange={(e) => setState({ title: e.target.value })} className="form-input" placeholder="Enter Title" />
                                            </div>

                                            <div className="mt-5">
                                                <label className="mb-2">Description</label>
                                                <textarea
                                                    className="form-input"
                                                    value={state.description}
                                                    onChange={(e) => setState({ description: e.target.value })}
                                                    placeholder="Enter Caption"
                                                ></textarea>
                                            </div>
                                            <div className="mt-5">
                                                <label className="mb-2">Caption</label>

                                                <textarea className="form-input" placeholder="Enter Alt Text" value={state.caption} onChange={(e) => setState({ caption: e.target.value })}></textarea>
                                            </div>

                                            <div className="mt-5">
                                                <label className="mb-2">File URL</label>
                                                <input type="text" className="form-input" placeholder="Enter Title" value={state.selectImg} />
                                                <button className="btn btn-primary-outline mt-2 text-sm" onClick={handleCopy}>
                                                    Copy URL to Clipboard
                                                </button>
                                                {state.copied ? <label className="mt-2 text-green-500">Copied</label> : <label className="mt-2">Copy Link</label>}
                                            </div>
                                            <div className="flex justify-end">
                                                <button type="submit" className="btn btn-primary " onClick={() => updateMetaData()}>
                                                    {mediaUpdateLoading ? <IconLoader /> : 'Update'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PrivateRouter(Media);
