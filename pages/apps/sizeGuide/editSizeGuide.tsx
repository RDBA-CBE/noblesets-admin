import {
    DateToStringFormat,
    Failure,
    Success,
    USDAmt,
    addNewMediaFile,
    dropdown,
    generateRandomCode,
    getFileType,
    getImageDimensions,
    resizeImage,
    resizingImage,
    useSetState,
} from '@/utils/functions';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Modal from '@/components/Modal';
import { DataTable, DataTableProps } from 'mantine-datatable';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import Select from 'react-select';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_NEW_MEDIA_IMAGE, COUPON_CHANNEL_UPDATE, COUPON_META_DATA, CREATE_COUPEN, GET_MEDIA_IMAGE, MEDIA_PAGINATION } from '@/query/product';
import { Description } from '@headlessui/react/dist/components/description/description';
import PrivateRouter from '@/components/Layouts/PrivateRouter';
import IconLoader from '@/components/Icon/IconLoader';
import DynamicSizeTable from '@/components/Layouts/DynamicTable';
import { CREATE_SIZEGUIDE, SIZEGUIDE_DETAIL, UPDATE_SIZEGUIDE } from '@/query/sizeGuide';
import * as Yup from 'yup';

const UpdateSizeGuide = () => {
    const router = useRouter();
    const id = router?.query?.id;

    const PAGE_LIMIT = 10;

    const [addNewImages, { loading: addNewImageLoading }] = useMutation(ADD_NEW_MEDIA_IMAGE);
    const [updateSizeGuide, { loading: updateLoading }] = useMutation(UPDATE_SIZEGUIDE);

    const { refetch: mediaRefetch } = useQuery(MEDIA_PAGINATION);

    const [createCoupons, { loading: createLoading }] = useMutation(CREATE_COUPEN);
    const { data: detail, refetch: coupenRefetch, loading } = useQuery(SIZEGUIDE_DETAIL);

    const [state, setState] = useSetState({
        imgFile: null,
        imagePreview: null,
        columns: [],
        rows: [],
    });

    useEffect(() => {
        getDetails();
        // categoryList();
    }, [id, detail]);

    const getDetails = async () => {
        try {
            const res = await coupenRefetch({
                id,
            });
            console.log('✌️res --->', res);
            setState({ tableHTML: res?.data?.sizeGuid?.sizedetail, imagePreview: res?.data?.sizeGuid?.sizeimg, name: res?.data?.sizeGuid?.name });
        } catch (error) {
            console.log('error: ', error);
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
                files = await resizeImage(files, 1160, 1340);
            } else {
                files = await resizeImage(files, 1160, 1340);
            }
            const { width, height } = await getImageDimensions(files);
        }

        const unique = await generateUniqueFilenames(files.name);
        console.log('✌️unique --->', unique);

        const result = await addNewMediaFile(files, unique);
        console.log('✌️result --->', result);
        const fileType = await getFileType(result);
        console.log('✌️fileType --->', fileType);
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

    const removeImage = () => {
        setState({ imagePreview: null, imgFile: null });
    };

    const tableData = (columns, rows) => {
        console.log('✌️columns,row --->', columns, rows);
        const tableRows = rows.map((row) => `<tr>${columns.map((col) => `<td>${row[col] || ''}</td>`).join('')}<td></td></tr>`).join('');

        const tableHTML = `
        <table border="1" cellpadding="5" cellspacing="0">
            <thead>
                <tr>
                    ${columns.map((col) => `<th>${col}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>`;
        setState({ tableHTML: tableHTML,rows, columns  });
    };

    const SubmittedForm = Yup.object()
        .shape({
            name: Yup.string().required('Please fill the Name'),
            image: Yup.string().required('Image is required'),
            // Custom test at the object level using `.test()` outside of individual fields
        })
        .test('rows-columns-validation', 'At least one row is required if columns are added, and all cells must be filled.', function (values) {
            const { columns, rows } = this.options.context;

            if (columns.length > 0 && rows.length === 0) {
                return this.createError({ path: 'size', message: 'At least one row is required if columns are added.' });
            }

            const hasEmptyCells = rows.some((row) => columns.some((col) => !row[col] || row[col].trim() === ''));

            if (hasEmptyCells) {
                return this.createError({ path: 'size', message: 'All row cells must be filled.' });
            }

            return true;
        });

    const handleSubmit = async () => {
        try {
            const values = {
                name: state.name,
                image: state.imagePreview,
            };

            await SubmittedForm.validate(values, {
                abortEarly: false,
                context: {
                    columns: state.columns,
                    rows: state.rows,
                },
            });

            const body: any = {};
            if (state.imgFile) {
                let sizeimg = await addNewImage(state.imgFile);
                body.sizeimg = encodeURI(sizeimg);
            } else {
                body.sizeimg = body.sizeimg;
            }
            if (state.tableHTML) {
                body.sizedetail = state.tableHTML;
            }
            const inputs = {
                id,
                input: {
                    sizeimg: body.sizeimg,
                    sizedetail: body.sizedetail,
                    name: state.name,
                },
            };

            const res = await updateSizeGuide({ variables: inputs });
            if (res?.data?.sizeGuidUpdated?.errors?.length > 0) {
                Failure(res.data.sizeGuidUpdated.errors[0].message);
            } else {
                Success('Size Guide Updated Successfully');
                router.push('/apps/sizeGuide/sizeGuide');
            }
        } catch (err) {
            if (err.inner) {
                const newErrors = {};
                err.inner.forEach((e) => {
                    newErrors[e.path] = e.message;
                });
                setState({ errors: newErrors });
            }
            console.log('✌️error --->', err);
        }
    };

    return (
        <>
            <div className="panel mb-5 flex items-center justify-between gap-5">
                <h5 className="text-lg font-semibold dark:text-white-light">Update Size Guide</h5>
            </div>

            <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                Name
            </label>
            <input
                type="text"
                value={state.name}
                onChange={(e) => setState({ name: e.target.value, errors: { nameError: '' } })}
                placeholder="Enter  Name"
                name="name"
                className="form-input"
                required
            />
            {state.errors?.name && <p className="mt-[4px] text-[14px] text-red-600">{state.errors?.name}</p>}

            <div className="active pt-5 ">
                {!state.imagePreview ? (
                    <div className="flex h-[100px] items-center justify-center">
                        <div className="w-1/2 text-center">
                            <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                                Upload Image
                            </label>
                            <p className="mb-2 text-sm">or</p>
                            <input type="file" accept="image/*" className="mb-2 ml-32" onChange={uploadFiles} />
                            <p className="mb-2 text-sm">Maximum upload file size: 30 MB.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex  items-center gap-4">
                        <img src={state.imagePreview} alt="Uploaded" className="max-h-[400px] rounded shadow" />
                        <div className="flex gap-3">
                            <button onClick={() => document.getElementById('image-upload').click()} className="rounded bg-blue-600 px-4 py-2 text-white">
                                Replace Image
                            </button>
                            {/* <button onClick={removeImage} className="rounded bg-red-500 px-4 py-2 text-white">
                                Remove
                            </button> */}
                        </div>
                        <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={uploadFiles} />
                    </div>
                )}
            </div>
            {state.errors?.image && <div className="mt-1 text-danger">{state.errors?.image}</div>}

            <div>
                <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                    Size Chart
                </label>

                <DynamicSizeTable tableData={tableData} htmlTableString={state.tableHTML} />
                {state.errors?.size && <div className="mt-1 text-danger">{state.errors?.size}</div>}
            </div>
            <div className="flex items-center justify-end gap-5 pt-5">
                <button type="button" className="btn btn-outline-primary  w-full md:mb-0 md:w-auto" onClick={() => router.push('/apps/sizeGuide/sizeGuide')}>
                    Cancel
                </button>
                <button type="button" className="btn btn-primary  w-full md:mb-0 md:w-auto" onClick={() => handleSubmit()}>
                    {updateLoading ? <IconLoader /> : 'Submit'}
                </button>
            </div>
        </>
    );
};

export default PrivateRouter(UpdateSizeGuide);
