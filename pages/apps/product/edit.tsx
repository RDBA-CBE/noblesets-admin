import React, { useEffect, useState, Fragment, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import 'tippy.js/dist/tippy.css';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Select from 'react-select';
import 'react-quill/dist/quill.snow.css';
import pdf from '../../../public/assets/images/pdf.png';
import docs from '../../../public/assets/images/docs.jpg';
import { Tab } from '@headlessui/react';
import AnimateHeight from 'react-animate-height';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
    COLLECTION_LIST,
    CREATE_PRODUCT,
    CREATE_VARIANT,
    DELETE_VARIENT,
    PARENT_CATEGORY_LIST,
    PRODUCTS_MEDIA_ORDERS,
    PRODUCT_BY_NAME,
    PRODUCT_FULL_DETAILS,
    PRODUCT_LIST_TAGS,
    PRODUCT_MEDIA_CREATE_NEW,
    PRODUCT_TYPE_LIST,
    RELATED_PRODUCT,
    REMOVE_IMAGE,
    UPDATE_META_DATA,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_CHANNEL,
    UPDATE_VARIANT,
    UPDATE_VARIANT_LIST,
    PRODUCT_LIST_BY_ID,
    ADD_NEW_MEDIA_IMAGE,
    UPDATE_MEDIA_IMAGE,
    DELETE_MEDIA_IMAGE,
    GET_MEDIA_IMAGE,
    MEDIA_PAGINATION,
    UPDATED_PRODUCT_PAGINATION,
    NEW_PARENT_CATEGORY_LIST,
    VARIANT_UPDATES,
    GET_BRAND,
    GET_SIZEGUIDE,
} from '@/query/product';
import {
    CHANNEL_USD,
    ConvertToSlug,
    Failure,
    Success,
    TAX_CLASS,
    WAREHOUSE_ID,
    addCommasToNumber,
    addNewMediaFile,
    capitalizeFLetter,
    formatOptions,
    getFileNameFromUrl,
    getFileType,
    getImageDimensions,
    getKey,
    getMonthNumber,
    getRowsAndColumnss,
    getValueByKey,
    months,
    objIsEmpty,
    resizeImage,
    resizingImage,
    sampleParams,
    showDeleteAlert,
    uploadImage,
} from '@/utils/functions';
import PrivateRouter from '@/components/Layouts/PrivateRouter';
import IconLoader from '@/components/Icon/IconLoader';
import moment from 'moment';
import CommonLoader from '@/pages/elements/commonLoader';
import Image from 'next/image';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconArrowForward from '@/components/Icon/IconArrowForward';
import CategorySelect from '@/components/CategorySelect';
import TagSelect from '@/components/TagSelect';
import SizeGuideSelect from '@/components/Layouts/SizeGuideSelect';
import BrandSelect from '@/components/Layouts/BrandSelect';
import { BRAND_LIST } from '@/query/brand';
import { SIZEGUIDE_LIST } from '@/query/sizeGuide';
import DynamicSizeTable from '@/components/Layouts/DynamicTable';
import { CREATE_PRICE_BREAKUP, UPDATE_PRICE_BREAKUP } from '@/query/priceBreakUp';
import ProductTabs from '@/components/Layouts/ProductTabs';

const ProductEdit = (props: any) => {
    const router = useRouter();

    const { id } = router.query;

    const PAGE_SIZE = 30;

    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [mediaImages, setMediaImages] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [alt, setAlt] = useState('');
    const [caption, setCaption] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mediaTab, setMediaTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Update Product'));
    });

    const [isMounted, setIsMounted] = useState(false); //tabs
    useEffect(() => {
        setIsMounted(true);
    });
    const [menuOrder, setMenuOrder] = useState(null);
    const [selectedUpsell, setSelectedUpsell] = useState([]);
    const [selectedCrosssell, setSelectedCrosssell] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [attributesData, setAttributesData] = useState([]);
    // ------------------------------------------New Data--------------------------------------------

    const [productName, setProductName] = useState('');
    const [slug, setSlug] = useState('');
    const [seoTittle, setSeoTittle] = useState('');
    const [seoDesc, setSeoDesc] = useState('');

    const [shortDescription, setShortDescription] = useState('');
    const [mediaSearch, setMediaSearch] = useState('');

    const [mediaDescription, setMediaDescription] = useState('');
    const [selectedCollection, setSelectedCollection] = useState<any>([]);
    const [publish, setPublish] = useState('published');

    const [activeTab, setActiveTab] = useState('Product Details');

    const { data: getBrands, loading: brandLoading, refetch: getBrand } = useQuery(GET_BRAND);

    const { data: getSizeGuides, loading: getSizeGuideLoading, refetch: getSizeGuide } = useQuery(GET_SIZEGUIDE);

    // error message start

    const [productNameErrMsg, setProductNameErrMsg] = useState('');
    const [slugErrMsg, setSlugErrMsg] = useState('');
    const [seoTittleErrMsg, setSeoTittleErrMsg] = useState('');
    const [seoDescErrMsg, setSeoDescErrMsg] = useState('');
    const [descriptionErrMsg, setDescriptionErrMsg] = useState('');
    const [productListUpsell, setProductListUpsell] = useState([]);
    const [productListCrossell, setProductListCrossell] = useState([]);
    const [searchUpsells, setSearchUpsells] = useState('');
    const [searchCrossell, setSearchCrossell] = useState('');
    const [shortDesErrMsg, setShortDesErrMsg] = useState('');
    const [categoryErrMsg, setCategoryErrMsg] = useState('');
    const [variantErrors, setVariantErrors] = useState<any>([]);
    const [mediaStartCussor, setMediaStartCussor] = useState('');
    const [mediaEndCursor, setMediaEndCursor] = useState('');
    const [mediaHasNextPage, setMediaHasNextPage] = useState(false);
    const [mediaPreviousPage, setMediaPreviousPage] = useState(false);
    const [priceBreakUpError, setPriceBreakUpError] = useState('');
    const [selectedBrand, setselectedBrand] = useState<any>(null);
    const [selectedSizeGuide, setSelectedSizeGuide] = useState<any>(null);

    // error message end

    // ------------------------------------------New Data--------------------------------------------
    const [active, setActive] = useState<string>('1');

    const options = [
        { value: 'New', label: 'New' },
        { value: 'Hot', label: 'Hot' },
    ];
    const { refetch: mediaRefetch } = useQuery(MEDIA_PAGINATION);

    const { refetch: refreshfetch } = useQuery(UPDATED_PRODUCT_PAGINATION);

    // -------------------------------------New Added-------------------------------------------------------
    const { data: productDetails } = useQuery(PRODUCT_FULL_DETAILS, {
        variables: { channel: 'india-channel', id: id },
    });

    const { refetch: relatedProductsRefetch } = useQuery(RELATED_PRODUCT);

    const { data: tagsList } = useQuery(PRODUCT_LIST_TAGS, {
        variables: { channel: 'india-channel', id: id, first: 100 },
    });

    const { refetch: productListRefetch } = useQuery(PRODUCT_LIST_BY_ID);

    const [createMedia] = useMutation(PRODUCT_MEDIA_CREATE_NEW);

    const { data: collection_list } = useQuery(COLLECTION_LIST, {
        variables: sampleParams,
    });

    const { data: productTypelist } = useQuery(PRODUCT_TYPE_LIST, {
        variables: sampleParams,
    });

    const { data: parentList, error: parentListError } = useQuery(PARENT_CATEGORY_LIST, {
        variables: { channel: 'india-channel' },
    });
    const { refetch: categorySearchRefetch } = useQuery(NEW_PARENT_CATEGORY_LIST, {
        variables: { channel: 'india-channel' },
    });

    const { refetch: brandRefetch } = useQuery(BRAND_LIST, {
        variables: { channel: 'india-channel' },
    });

    const { refetch: sizeGuideRefetch } = useQuery(SIZEGUIDE_LIST, {
        variables: { channel: 'india-channel' },
    });

    const { refetch: tagRefetch, loading: tagloading } = useQuery(PRODUCT_LIST_TAGS);

    const fetchCategories = async (variables) => {
        return await categorySearchRefetch(variables);
    };

    const fetchBrands = async (variables) => {
        return await brandRefetch(variables);
    };

    const fetchSizeGuide = async (variables) => {
        return await sizeGuideRefetch(variables);
    };

    const fetchTag = async (variables) => {
        return await tagRefetch(variables);
    };

    const [priceBreakupUpdate] = useMutation(UPDATE_PRICE_BREAKUP);

    const [addFormData] = useMutation(CREATE_PRODUCT);
    const [updateProductChannelList, { loading: updateChannelLoad }] = useMutation(UPDATE_PRODUCT_CHANNEL);
    const [updateVariantList, { loading: updateVariantListLoad }] = useMutation(UPDATE_VARIANT_LIST);
    const [updateVariant, { loading: updateVariantLoad }] = useMutation(UPDATE_VARIANT);
    const [updateSingleVariant, { loading: updateSingleVariantLoad }] = useMutation(VARIANT_UPDATES);

    const [updateMedatData, { loading: updatemedaLoad }] = useMutation(UPDATE_META_DATA);
    // const [assignTagToProduct,{loading:updateAssignTagLoad}] = useMutation(ASSIGN_TAG_PRODUCT);
    const [mediaReorder, { loading: updateMediaReorderLoad }] = useMutation(PRODUCTS_MEDIA_ORDERS);
    const [createVariant, { loading: createVariantLoad }] = useMutation(CREATE_VARIANT);
    const [removeImage] = useMutation(REMOVE_IMAGE);
    const [updateProduct, { loading: updateProductLoad }] = useMutation(UPDATE_PRODUCT);
    const [deleteVarient, { loading: deleteVariantLoad }] = useMutation(DELETE_VARIENT);
    const [priceBreakupCreate] = useMutation(CREATE_PRICE_BREAKUP);

    const longPressTimeout = useRef(null);

    const [columns, setColumns] = useState([]);
    const [rows, SetRows] = useState([]);

    const [addNewImages] = useMutation(ADD_NEW_MEDIA_IMAGE);
    const [updateImages, { loading: mediaUpdateLoading }] = useMutation(UPDATE_MEDIA_IMAGE);
    const [deleteImages] = useMutation(DELETE_MEDIA_IMAGE);
    const { data, refetch: getListRefetch } = useQuery(GET_MEDIA_IMAGE);

    const { data: productSearch, refetch: productSearchRefetch } = useQuery(PRODUCT_BY_NAME);

    const [categoryList, setCategoryList] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [selectedTag, setSelectedTag] = useState([]);
    const [collectionList, setCollectionList] = useState([]);
    const [label, setLabel] = useState<any>('');
    const [productData, setProductData] = useState({});
    const [modal4, setModal4] = useState(false);

    const [productType, setProductType] = useState([]);
    const [mediaData, setMediaData] = useState(null);
    const [productList, setProductList] = useState([]);
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [productPreview, setPreviewData] = useState(null);
    const [previewSelectedImg, setPreviewSelectedImg] = useState(null);
    const [tableHtml, setTableHtml] = useState(null);

    const [imageUrl, setImageUrl] = useState([]);

    const [thumbnail, setThumbnail] = useState('');

    const [images, setImages] = useState<any>([]);
    const [copied, setCopied] = useState(false);
    const [isLongPress, setIsLongPress] = useState(false);
    const [deletedImages, setDeletedImages] = useState<any>([]);
    const [dropIndex, setDropIndex] = useState<any>(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [mediaMonth, setMediaMonth] = useState('all');
    const [mediaType, setMediaType] = useState('all');
    const [selectedCat, setselectedCat] = useState<any>([]);
    const [monthNumber, setMonthNumber] = useState(null);
    const [priceBreackupId, setPriceBreackupId] = useState(null);

    const [variants, setVariants] = useState([
        {
            sku: '',
            stackMgmt: false,
            quantity: 0,
            regularPrice: 0,
            salePrice: 0,
            name: '',
            id: '',
        },
    ]);

    // const { data: customerData, refetch: customerListRefetch } = useQuery(MEDIA_PAGINATION, {
    //     variables: {
    //         first: PAGE_SIZE,
    //         after: null,
    //         fileType: mediaType == 'all' ? '' : mediaType,
    //         month: 9,
    //         year: 2025,
    //         name: '',
    //     },
    //     onCompleted: (data) => {
    //         commonPagination(data);
    //     },
    // });

    const handleNextPage = () => {
        fetchNextPage({
            variables: {
                first: PAGE_SIZE,
                after: mediaEndCursor,
                before: null,
                fileType: mediaType == 'all' ? '' : mediaType,
                month: monthNumber,
                year: 2025,
                name: mediaSearch,
            },
        });
    };

    const handlePreviousPage = () => {
        fetchPreviousPage({
            variables: {
                last: PAGE_SIZE,
                before: mediaStartCussor,
                fileType: mediaType == 'all' ? '' : mediaType,
                month: monthNumber,
                year: 2025,
                name: mediaSearch,
            },
        });
    };

    const commonPagination = (data) => {
        setMediaImages(data.files.edges);
        setMediaStartCussor(data.files.pageInfo.startCursor);
        setMediaEndCursor(data.files.pageInfo.endCursor);
        setMediaHasNextPage(data.files.pageInfo.hasNextPage);
        setMediaPreviousPage(data.files.pageInfo.hasPreviousPage);
    };

    useEffect(() => {
        productsDetails();
    }, [productDetails]);

    useEffect(() => {
        tags_list();
    }, [tagsList]);

    useEffect(() => {
        collections_list();
    }, [collection_list]);

    useEffect(() => {
        productsType();
    }, [productTypelist]);

    useEffect(() => {
        getProductForUpsells();
    }, [searchUpsells]);

    useEffect(() => {
        getProductForCrossell();
    }, [searchCrossell]);

    useEffect(() => {
        const getparentCategoryList = parentList?.categories?.edges;
        setCategoryList(getparentCategoryList);
    }, [parentList]);

    useEffect(() => {
        const getparentCategoryList = parentList?.categories?.edges;
        const options = formatOptions(getparentCategoryList);
        setCategoryList(options);
    }, [parentList]);

    useEffect(() => {
        if (mediaType == 'all') {
            refresh();
        } else {
            filterByTypes();
        }
    }, [mediaType]);

    const filterByTypes = async () => {
        try {
            const res = await mediaRefetch({
                first: PAGE_SIZE,
                after: null,
                fileType: mediaType == 'all' ? '' : mediaType,
                month: null,
                year: null,
                name: '',
            });

            commonPagination(res.data);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const productsDetails = async () => {
        try {
            if (productDetails) {
                if (productDetails && productDetails?.product) {
                    const data = productDetails?.product;
                    console.log('✌️data --->', data);
                    setProductData(data);
                    setSlug(data?.slug);
                    setSeoTittle(data?.seoTitle);
                    setSeoDesc(data?.seoDescription);
                    setProductName(data?.name);

                    let upsells = [];
                    if (data?.getUpsells?.length > 0) {
                        upsells = data?.getUpsells?.map((item) => ({ value: item.productId, label: item.name }));
                    }
                    setSelectedUpsell(upsells);

                    let crossells = [];
                    if (data?.getCrosssells?.length > 0) {
                        crossells = data?.getCrosssells?.map((item) => ({ value: item.productId, label: item.name }));
                    }

                    setselectedCat(data?.category?.map((item) => ({ value: item.id, label: item.name })));

                    setSelectedCrosssell(crossells);

                    if (!objIsEmpty(data?.brand)) {
                        setselectedBrand({ value: data?.brand?.id, label: data?.brand?.name });
                    }
                    if (!objIsEmpty(data?.sizeGuide)) {
                        setSelectedSizeGuide({ value: data?.sizeGuide?.id, label: data?.sizeGuide?.name });
                    }
                    if (!objIsEmpty(data?.priceBreakup)) {
                        setPriceBreackupId(data?.priceBreakup?.id);
                        setTableHtml(data?.priceBreakup?.breakupDetails);

                        const getData = getRowsAndColumnss(data?.priceBreakup?.breakupDetails);
                        console.log('✌️getData --->', getData);
                        if (getData?.columns?.length > 0) {
                            setColumns(getData?.columns);
                        }
                        if (getData?.rows?.length > 0) {
                            SetRows(getData?.rows);
                        }
                    } else {
                        const sampleData = `
        <table>
      <thead>
        <tr>
          <th>Metal Cost</th>
          <th>Making Charge</th>
          <th>Stone Value</th>
          <th>Gross Value</th>
          <th>GST(3%)</th>
          <th>Final Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td></td>
           <td></td>
          <td></td> 
          <td></td>
          <td></td>
        </tr>
        
      </tbody>
    </table>`;
                        setPriceBreackupId(null);
                        setTableHtml(sampleData);

                        const getData = getRowsAndColumnss(sampleData);
                        console.log('✌️getData --->', getData);
                        if (getData?.columns?.length > 0) {
                            setColumns(getData?.columns);
                        }
                        if (getData?.rows?.length > 0) {
                            SetRows(getData?.rows);
                        }
                    }

                    if (data?.tags?.length > 0) {
                        const tags: any = data?.tags?.map((item: any) => ({ value: item.id, label: item.name }));
                        setSelectedTag(tags);
                    } else {
                        setSelectedTag([]);
                    }
                    if (data?.collections?.length > 0) {
                        const collection: any = data?.collections?.map((item: any) => ({ value: item.id, label: item.name }));
                        setSelectedCollection(collection);
                    }
                    setMenuOrder(data?.orderNo);

                    const Description = JSON.parse(data.description);
                    DescriptionEditor(Description);

                    const shortDesc = getValueByKey(data?.metadata, 'short_description');
                    setShortDescription(shortDesc);

                    const keywords = getValueByKey(data?.metadata, 'keyword');
                    setKeyword(keywords);

                    const label = getValueByKey(data?.metadata, 'label');
                    setLabel({ value: label, label: label });

                    const desc = getValueByKey(data?.metadata, 'description');
                    setDescription(desc);

                    setThumbnail(data?.thumbnail?.url);

                    if (data?.media?.length > 0) {
                        setImages(data?.media);
                        setImageUrl(data?.media?.map((item) => item.url));
                    }

                    Attributes(data);
                    setAttributesData(productDetails?.product?.attributes);
                    if (data?.variants?.length > 0) {
                        const variant = data?.variants?.map((item: any) => ({
                            sku: item.sku,
                            stackMgmt: item.trackInventory,
                            quantity: item?.stocks[0]?.quantity,
                            regularPrice: item.channelListings[0]?.costPrice?.amount,
                            salePrice: item.channelListings[0]?.price?.amount,
                            name: item.name,
                            id: item.id,
                            channelId: item.channelListings[0]?.id,
                            stockId: item?.stocks[0]?.id,
                        }));
                        setVariants(variant);
                    }
                    setPublish(data?.channelListings[0]?.isPublished == true ? 'published' : 'draft');
                }
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const handleSelectChange = (attributeId, selectedOptions) => {
        const selectedValues = selectedOptions.map((option) => option.slug); // Access slug here
        setSelectedAttributes((prev) => ({
            ...prev,
            [attributeId]: selectedValues, // Store slugs in the state
        }));
    };

    const Attributes = async (data) => {
        const selectedAttributes = data?.attributes?.reduce((acc, attr) => {
            if (attr.values && attr.values.length > 0) {
                const selectedValues = attr.values.map((val) => val.slug);
                acc[attr.attribute.id] = selectedValues;
            }
            return acc;
        }, {});

        setSelectedAttributes((prev) => ({
            ...prev,
            ...selectedAttributes,
        }));
    };

    const DescriptionEditor = async (Description) => {
        try {
            let formattedData = {};
            if (Description && Description.blocks) {
                const formattedBlocks = Description.blocks.map((block) => ({
                    ...block,
                    data: {
                        ...block.data,
                        text: block.data.text ? block.data.text.replace(/\n/g, '<br>') : block.data.text, // Convert newlines to <br> for HTML display if text exists
                    },
                }));
                formattedData = {
                    ...Description,
                    blocks: formattedBlocks,
                };
            }

            let editors = { isReady: false };
            if (!editors.isReady) {
                editor(formattedData);
                editors.isReady = true;
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    // editor start

    const editorRef = useRef(null);
    const [editorInstance, setEditorInstance] = useState(null);
    const [content, setContent] = useState('');

    const editor = useCallback((value) => {
        // Check if the window object is available and if the editorRef.current is set
        if (typeof window === 'undefined' || !editorRef.current) return;

        // Ensure only one editor instance is created
        if (editorInstance) {
            return;
        }

        // Dynamically import the EditorJS module
        import('@editorjs/editorjs').then(({ default: EditorJS }) => {
            // Create a new instance of EditorJS with the appropriate configuration
            const editor = new EditorJS({
                holder: editorRef.current,
                data: value,
                tools: {
                    // Configure tools as needed
                    header: {
                        class: require('@editorjs/header'),
                    },
                    list: {
                        class: require('@editorjs/list'),
                    },
                    table: {
                        class: require('@editorjs/table'),
                    },
                },
            });

            // Set the editorInstance state variable
            setEditorInstance(editor);
        });

        // Cleanup function to destroy the current editor instance when the component unmounts
        return () => {
            if (editorInstance) {
                editorInstance?.blocks?.clear();
            }
        };
    }, []);

    const tags_list = async () => {
        try {
            if (tagsList) {
                if (tagsList && tagsList?.tags?.edges?.length > 0) {
                    const list = tagsList?.tags?.edges;
                    const dropdownData = list?.map((item: any) => {
                        return { value: item.node?.id, label: item.node?.name };
                    });
                    setTagList(dropdownData);
                }
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

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

    const collections_list = async () => {
        try {
            if (collection_list) {
                if (collection_list && collection_list?.search?.edges?.length > 0) {
                    const list = collection_list?.search?.edges;
                    const dropdownData = list?.map((item: any) => {
                        return { value: item.node?.id, label: item.node?.name };
                    });

                    setCollectionList(dropdownData);
                }
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const productsType = async () => {
        try {
            if (productTypelist) {
                if (productTypelist && productTypelist?.search?.edges?.length > 0) {
                    const list = productTypelist?.search?.edges;
                    const dropdownData = list?.map((item: any) => {
                        return { value: item.node?.id, label: item.node?.name };
                    });

                    setProductType(dropdownData);
                }
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const handleFileChange = async (e: any) => {
        try {
            await addNewImage(e);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const generateUniqueFilenames = async (filename) => {
        let uniqueFilename = filename;
        let counter = 0;
        let fileExists = true;

        while (fileExists) {
            const res = await mediaRefetch({
                first: PAGE_SIZE,
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

    const addNewImage = async (e) => {
        let files = e.target.files[0];
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
        setSelectedImages([...selectedImages, { node: response?.data?.fileCreate?.file }]);
        const bodys = {
            node: {
                fileUrl: response.data?.fileCreate?.file?.fileUrl,
            },
        };
        handleClickImage(bodys);
        if (imageUrl?.length > 0) {
            setImageUrl([...imageUrl, response.data?.fileCreate?.file?.fileUrl]);
        } else {
            setImageUrl([response.data?.fileCreate?.file?.fileUrl]);
        }

        await refresh();
        setMediaTab(1);
        Success('File added successfully');
    };

    const multiImgUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile: any = event.target.files?.[0];
        setModal4(false);
        const res = await uploadImage(id, selectedFile);
        setImages(res?.data?.productMediaCreate?.product?.media);
    };

    const multiImageDelete = async (val: any) => {
        console.log('multiImageDelete: ');
        showDeleteAlert(
            async () => {
                // const { data } = await removeImage({
                //     variables: { id: val },
                // });
                setDeletedImages([...deletedImages, val]);
                // const filter = images?.filter((item) => item.url !== val);
                const filter = images?.filter((item) => item.id !== val.id);
                setImages(filter);
                Swal.fire('Deleted!', 'Your files have been deleted.', 'success');
            },
            () => {
                Swal.fire('Cancelled', 'Your Image List is safe :)', 'error');
            }
        );
    };

    const validateMainFields = (savedContent) => {
        let errors: any;
        const hasEmptyCells = rows.some((row) => columns.some((col) => !row[col] || row[col].trim() === ''));

        if (publish !== 'draft') {
            errors = {
                productName: productName == '' ? 'Product name cannot be empty' : '',
                slug: slug == '' ? 'Slug cannot be empty' : '',
                seoTittle: seoTittle == '' ? 'Seo title cannot be empty' : '',
                seoDesc: seoDesc == '' ? 'Seo description cannot be empty' : '',
                description: savedContent?.blocks?.length == 0 ? 'Description cannot be empty' : '',
                shortDescription: shortDescription == '' ? 'Short description cannot be empty' : '',
                category: selectedCat?.length == 0 ? 'Category cannot be empty' : '',
                priceBreakup:
                    columns.length == 0
                        ? 'At least column is required'
                        : columns.length > 0 && rows.length == 0
                        ? 'At least one row is required if columns are added.'
                        : hasEmptyCells
                        ? 'All row cells must be filled.'
                        : '',
            };
        } else {
            errors = {
                productName: productName == '' ? 'Product name cannot be empty' : '',
            };
        }

        return errors;
    };

    // Helper function to validate variants
    const validateVariants = () => {
        return variants.map((variant) => {
            const errors: any = {};
            if (!variant.sku) errors.sku = 'SKU cannot be empty';
            if (variant.regularPrice <= 0 || isNaN(variant.regularPrice)) errors.regularPrice = 'Price must be a valid number and greater than 0';
            return errors;
        });
    };

    const updateProducts = async () => {
        try {
            const savedContent = await editorInstance.save();
            const descr = JSON.stringify(savedContent, null, 2);
            const att = attributesData
                .map((attr) => {
                    const selectedValues = selectedAttributes[attr.attribute.id] || [];

                    return selectedValues.length > 0
                        ? {
                              id: attr.attribute.id,
                              values: selectedValues,
                          }
                        : null;
                })
                .filter(Boolean); // Filters out any null values where no selections were made
            console.log('✌️descr --->', descr);

            setProductNameErrMsg('');
            setSlugErrMsg('');
            setSeoTittleErrMsg('');
            setSeoDescErrMsg('');
            setShortDesErrMsg('');
            setCategoryErrMsg('');
            setDescriptionErrMsg('');
            setVariantErrors([]);
            console.log('errors: ');

            const errors = validateMainFields(JSON.parse(descr));
            console.log('errors: ', errors);
            const variantErrors = validateVariants();
            console.log('variantErrors: ', variantErrors);

            if (publish !== 'draft') {
                setProductNameErrMsg(errors.productName);
                setSlugErrMsg(errors.slug);
                setSeoTittleErrMsg(errors.seoTittle);
                setSeoDescErrMsg(errors.seoDesc);
                setDescriptionErrMsg(errors.description);
                setShortDesErrMsg(errors.shortDescription);
                setCategoryErrMsg(errors.category);
                setVariantErrors(variantErrors);
                setPriceBreakUpError(errors?.priceBreakup);

                if (Object.values(errors).some((msg) => msg !== '') || variantErrors.some((err) => Object.keys(err).length > 0)) {
                    // setCreateLoading(false);
                    Failure('Please fill in all required fields');
                    return; // Exit if any error exists
                } else {
                    console.log('else: ');
                    let upsells = [];
                    if (selectedUpsell?.length > 0) {
                        upsells = selectedUpsell?.map((item) => item?.value);
                    }
                    let crosssells = [];
                    if (selectedCrosssell?.length > 0) {
                        crosssells = selectedCrosssell?.map((item) => item?.value);
                    }

                    const tagId = selectedTag?.map((item) => item.value) || [];
                    // const savedContent = await editorInstance.save();
                    // const descr = JSON.stringify(savedContent, null, 2);
                    const { data } = await updateProduct({
                        variables: {
                            id: id,
                            input: {
                                category: selectedCat?.map((item) => item?.value),
                                collections: [],
                                tags: tagId,
                                name: productName,
                                description: descr,
                                rating: 0,
                                seo: {
                                    description: seoDesc,
                                    title: seoTittle,
                                },
                                upsells,
                                crosssells,
                                slug: slug ? ConvertToSlug(slug) : '',

                                order_no: menuOrder,
                                attributes: att,
                                brand: selectedBrand?.value ? selectedBrand?.value : null,

                                size_guide: selectedSizeGuide?.value ? selectedSizeGuide?.value : null,
                                taxClass: TAX_CLASS,
                            },
                            firstValues: 10,
                        },
                    });

                    if (data?.productUpdate?.errors?.length > 0) {
                        Failure(data?.productUpdate?.errors[0]?.message);
                        setUpdateLoading(false);
                    } else {
                        productChannelListUpdate();
                    }
                }
            } else {
                if (Object.values(errors).some((msg) => msg !== '')) {
                    setProductNameErrMsg(errors.productName);
                    Failure('Please fill in all required fields');
                    return; // Exit if any error exists
                } else {
                    console.log('else: ');
                    let upsells = [];
                    if (selectedUpsell?.length > 0) {
                        upsells = selectedUpsell?.map((item) => item?.value);
                    }
                    let crosssells = [];
                    if (selectedCrosssell?.length > 0) {
                        crosssells = selectedCrosssell?.map((item) => item?.value);
                    }

                    const tagId = selectedTag?.map((item) => item.value) || [];
                    // const savedContent = await editorInstance.save();
                    // const descr = JSON.stringify(savedContent, null, 2);
                    const { data } = await updateProduct({
                        variables: {
                            id: id,
                            input: {
                                attributes: att,
                                category: selectedCat?.map((item) => item?.value),
                                collections: [],
                                tags: tagId,
                                name: productName,
                                description: descr,
                                rating: 0,
                                seo: {
                                    description: seoDesc,
                                    title: seoTittle,
                                },
                                upsells,
                                crosssells,
                                slug: slug ? ConvertToSlug(slug) : '',
                                order_no: menuOrder,
                                brand: selectedBrand?.value ? selectedBrand?.value : null,
                                size_guide: selectedSizeGuide?.value ? selectedSizeGuide?.value : null,

                                taxClass: TAX_CLASS,
                            },
                            firstValues: 10,
                        },
                    });

                    if (data?.productUpdate?.errors?.length > 0) {
                        Failure(data?.productUpdate?.errors[0]?.message);
                        setUpdateLoading(false);
                    } else {
                        productChannelListUpdate();
                    }
                }
            }
        } catch (error) {
            setUpdateLoading(false);
        } finally {
            setUpdateLoading(false);
        }
    };

    const productChannelListUpdate = async () => {
        try {
            const { data } = await updateProductChannelList({
                variables: {
                    id: id,
                    input: {
                        updateChannels: [
                            {
                                availableForPurchaseDate: null,
                                channelId: CHANNEL_USD,
                                isAvailableForPurchase: true,
                                isPublished: publish == 'draft' ? false : true,
                                publicationDate: null,
                                visibleInListings: true,
                            },
                        ],
                    },
                },
                // variables: { email: formData.email, password: formData.password },
            });
            if (data?.productChannelListingUpdate?.errors?.length > 0) {
                setUpdateLoading(false);
                Failure(data?.productChannelListingUpdate?.errors[0]?.message);
            } else {
                if (priceBreackupId) {
                    updatePriceBreakup();
                } else {
                    createPriceBreakup();
                }
                variantListUpdate();
                const updatedImg = images?.map((item: any) => item.id);
                if (deletedImages?.length > 0) {
                    deletedImages?.map(async (val: any) => {
                        const { data } = await removeImage({
                            variables: { id: val.id },
                        });
                    });
                }
                await mediaReorder({
                    variables: {
                        mediaIds: updatedImg,
                        productId: id,
                    },
                });
            }
        } catch (error) {
            setUpdateLoading(false);

            console.log('error: ', error);
        }
    };

    const createPriceBreakup = async () => {
        try {
            const { data } = await priceBreakupCreate({
                variables: {
                    product: id,
                    breakupDetails: tableHtml,
                },
            });
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const updatePriceBreakup = async () => {
        try {
            const { data } = await priceBreakupUpdate({
                variables: {
                    id: priceBreackupId,
                    product: id,
                    breakupDetails: tableHtml,
                },
            });
            console.log('✌️data --->', data);
        } catch (error) {
            setUpdateLoading(false);

            console.log('error: ', error);
        }
    };

    const variantListUpdate = async () => {
        try {
            const arrayOfVariants = variants?.map((item: any) => ({
                attributes: [],
                id: item.id,
                sku: item.sku,
                name: item.name,
                trackInventory: item.stackMgmt,

                channelListings: {
                    update: [
                        {
                            channelListing: item.channelId,
                            price: item.regularPrice,
                            costPrice: item.regularPrice,
                        },
                    ],
                },
                stocks: {
                    update: [
                        {
                            quantity: item.quantity,
                            stock: item.stockId,
                        },
                    ],
                },
            }));

            // const NewAddedVariant = arrayOfVariants.filter((item) => item.id == undefined);
            const NewAddedVariant = variants.filter((item) => item.id == undefined || item.id == '');

            const updateArr = arrayOfVariants.filter((item) => item.id != undefined || item.id != '');

            if (NewAddedVariant?.length > 0) {
                bulkVariantCreate(NewAddedVariant);
            } else {
                if (updateArr?.length > 0) {
                    const { data } = await updateVariant({
                        variables: {
                            product: id,
                            input: updateArr,
                            errorPolicy: 'REJECT_FAILED_ROWS',
                        },
                    });

                    // if (data?.productVariantBulkUpdate?.errors?.length > 0) {
                    // variants?.map(async (variant: any) => {
                    //     const { data } = await updateSingleVariant({
                    //         variables: {
                    //             variantId: variant?.id,
                    //             // sku: variant?.sku,

                    //             channelId: CHANNEL_USD,
                    //             price: Number(variant?.regularPrice),
                    //             costPrice: Number(variant?.regularPrice),
                    //         },
                    //     });
                    //     console.log('✌️data --->', data);
                    // });

                    if (data?.productVariantBulkUpdate?.errors?.length > 0) {
                        setUpdateLoading(false);
                        Failure(data?.productVariantBulkUpdate?.errors[0]?.message);
                    } else if (data?.productVariantBulkUpdate?.results[0]?.errors?.length > 0) {
                        setUpdateLoading(false);
                        Failure(data?.productVariantBulkUpdate?.results[0]?.errors[0]?.message);
                    } else {
                        const results = data?.productVariantBulkUpdate?.results || [];

                        if (results.length > 0) {
                            // Find the first result with errors
                            const firstErrorResult = results.find((result) => result.errors?.length > 0);

                            if (firstErrorResult) {
                                const errorMessage = firstErrorResult.errors[0]?.message;
                                if (errorMessage) {
                                    Failure(errorMessage);
                                }
                            } else {
                                if (NewAddedVariant?.length === 0) {
                                    updateMetaData();
                                }
                            }
                        } else {
                            if (NewAddedVariant?.length === 0) {
                                updateMetaData();
                            }
                        }
                    }
                }
            }
        } catch (error) {
            setUpdateLoading(false);

            console.log('error: ', error);
        }
    };

    const updateMetaData = async () => {
        try {
            const input = [];
            if (shortDescription) {
                input.push({
                    key: 'short_description',
                    value: shortDescription ? shortDescription : '',
                });
            }
            if (keyword) {
                input.push({
                    key: 'keyword',
                    value: keyword,
                });
            }
            if (label?.value) {
                input.push({
                    key: 'label',
                    value: label.value,
                });
            }
            const { data } = await updateMedatData({
                variables: {
                    id: id,
                    input,
                    keysToDelete: [],
                },
            });
            if (data?.updateMetadata?.errors?.length > 0) {
                setUpdateLoading(false);
                Failure(data?.updateMetadata?.errors[0]?.message);
            } else {
                Success('Product updated successfully');
                // router.push('/');
                productRefresh();
                setUpdateLoading(false);
            }
        } catch (error) {
            setUpdateLoading(false);
            console.log('error: ', error);
        }
    };

    const bulkVariantCreate = async (NewAddedVariant: any) => {
        try {
            const variantArr = NewAddedVariant?.map((item: any) => ({
                attributes: [],
                sku: item.sku,
                name: item.name,
                trackInventory: item.stackMgmt,
                channelListings: [
                    {
                        channelId: CHANNEL_USD,
                        price: item.regularPrice,
                        costPrice: item.regularPrice,
                    },
                ],
                stocks: [
                    {
                        warehouse: WAREHOUSE_ID,
                        quantity: item.quantity,
                    },
                ],
            }));

            const { data } = await createVariant({
                variables: {
                    id: id,
                    inputs: variantArr,
                },
            });

            if (data?.productVariantBulkCreate?.errors?.length > 0) {
                setUpdateLoading(false);
                Failure(data?.productVariantBulkCreate?.errors[0]?.message);
            } else {
                const resVariants = data?.productVariantBulkCreate?.productVariants;
                if (resVariants?.length > 0 && NewAddedVariant?.length > 0) {
                    if (resVariants.length === NewAddedVariant.length) {
                        variantChannelListUpdate(resVariants, NewAddedVariant);
                    }
                }
            }
        } catch (error) {
            setUpdateLoading(false);

            console.log('error: ', error);
        }
    };

    const variantChannelListUpdate = async (resVariants: any[], NewAddedVariant: any[]) => {
        try {
            const updatePromises = resVariants.map((variant: any, index: number) => {
                const variantId = variant.id;
                const newVariantData = NewAddedVariant[index];

                const variantArr = [
                    {
                        channelId: CHANNEL_USD,
                        price: newVariantData.regularPrice,
                        costPrice: newVariantData.regularPrice,
                    },
                ];

                console.log('variantArr: ', variantArr);

                return updateVariantList({
                    variables: {
                        id: variantId,
                        input: variantArr,
                    },
                });
            });

            await Promise.all(updatePromises);

            if (data?.productVariantChannelListingUpdate?.errors?.length > 0) {
                setUpdateLoading(false);
                Failure(data?.productVariantChannelListingUpdate?.errors[0]?.message);
            } else {
                updateMetaData();
            }
        } catch (error) {
            setUpdateLoading(false);
            console.log('error: ', error);
        }
    };

    const handleChange = (index: any, fieldName: any, fieldValue: any) => {
        setVariants((prevItems) => {
            const updatedItems: any = [...prevItems];
            updatedItems[index][fieldName] = fieldValue;
            return updatedItems;
        });
    };

    const handleAddItem = () => {
        setVariants((prevItems: any) => [
            ...prevItems,
            {
                sku: '',
                stackMgmt: false,
                quantity: 0,
                regularPrice: 0,
                salePrice: 0,
                channelId: '',
            },
        ]);
    };

    const handleRemoveVariants = async (item: any, index: any) => {
        try {
            if (item?.id) {
                const res = await deleteVarient({
                    variables: {
                        id: item?.id,
                    },
                });
            }
            if (index === 0) return; // Prevent removing the first item
            setVariants((prevItems) => prevItems.filter((_, i) => i !== index));
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const handleDragStart = (e: any, id: any, i: any) => {
        e.dataTransfer.setData('id', id);
        setDropIndex(id);
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
    };

    const handleDrop = async (e: any, targetIndex: any) => {
        e.preventDefault();
        const imageId = e.dataTransfer.getData('id');
        const newIndex = parseInt(targetIndex, 10);
        let draggedImageIndex = -1;
        for (let i = 0; i < images.length; i++) {
            if (images[i].id === dropIndex) {
                draggedImageIndex = i;
                break;
            }
        }

        if (draggedImageIndex !== -1) {
            const newImages = [...images];
            const [draggedImage] = newImages.splice(draggedImageIndex, 1);
            newImages.splice(newIndex, 0, draggedImage);
            setImages(newImages);
        }
    };

    const getProductForUpsells = async () => {
        try {
            const res = await productSearchRefetch({
                name: searchUpsells,
            });

            const response = res?.data?.products?.edges;
            const dropdownData = response?.map((item: any) => ({ value: item?.node?.id, label: item?.node?.name }));
            setProductListUpsell(dropdownData);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const getProductForCrossell = async () => {
        try {
            const res = await productSearchRefetch({
                name: searchCrossell,
            });
            const response = res?.data?.products?.edges;
            const dropdownData = response?.map((item: any) => ({ value: item?.node?.id, label: item?.node?.name }));
            setProductListCrossell(dropdownData);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(selectedImg).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        });
    };
    const handleImageSelect = (item) => {
        setSelectedImages((prevSelectedImages) => {
            if (prevSelectedImages.includes(item)) {
                return prevSelectedImages.filter((image) => image !== item);
            } else {
                return [...prevSelectedImages, item];
            }
        });
    };

    const handleMouseDown = (item) => {
        longPressTimeout.current = setTimeout(() => {
            setIsLongPress(true);
            handleImageSelect(item);
        }, 1); // 100ms for long press
    };

    const handleMouseUp = () => {
        clearTimeout(longPressTimeout.current);
        setIsLongPress(false);
    };

    const handleMouseLeave = () => {
        clearTimeout(longPressTimeout.current);
        setIsLongPress(false);
    };

    const createMediaData = async (item) => {
        try {
            const { data } = await createMedia({
                variables: {
                    productId: id,
                    media_url: item,
                    alt: '',
                },
            });
            const resData = {
                id: data?.productMediaCreate?.media?.id,
                url: data?.productMediaCreate?.media?.url,
            };
            return resData;
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const newImageAdded = async () => {
        {
            let arr = [...images];
            // const urls = selectedImages?.map((item) => item.url);
            const urls = selectedImages?.map((item) => item?.node?.fileUrl);
            // const updatedUrls = urls.map((url) => url?.replace('.cdn', ''));
            urls.map(async (items) => {
                const { data } = await createMedia({
                    variables: {
                        productId: id,
                        media_url: items,
                        alt: '',
                    },
                });

                if (data?.productMediaCreate?.errors?.length > 0) {
                    Failure(data?.productMediaCreate?.errors[0]?.message);
                } else {
                    const resData = {
                        id: data?.productMediaCreate?.media?.id,
                        url: data?.productMediaCreate?.media?.url,
                    };
                    arr.push(resData);
                }
            });
            setImages(arr);
            setModal2(false);
            setSelectedImages([]);
            setSelectedImg(null);
        }
    };

    const mediaImageDelete = async () => {
        showDeleteAlert(deleteImage, () => {
            Swal.fire('Cancelled', 'Your Image List is safe :)', 'error');
        });
    };

    const deleteImage = async () => {
        try {
            const key = getFileNameFromUrl(selectedImg);
            await deleteImages({ variables: { file_url: selectedImg } });
            await refresh();
            setSelectedImg(null);
            Swal.fire('Deleted!', 'Your files have been deleted.', 'success');
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const getFullDetails = (selectedValues, arr) => {
        return Object.keys(selectedValues).reduce((acc, key) => {
            if (arr[key]) {
                acc[key] = arr[key].edges.filter((edge) => selectedValues[key].includes(edge.node.id)).map((edge) => edge.node);
            }
            return acc;
        }, {});
    };

    const previewClick = async () => {
        setPreviewLoading(true);
        const savedContent = await editorInstance?.save();
        let youMayLike = [];

        if (selectedCrosssell?.length > 0) {
            const listById = await productListRefetch({
                ids: selectedCrosssell?.map((item) => item?.value),
                channel: 'india-channel',
            });

            const modify = listById?.data?.products?.edges;
            if (modify.length > 0) {
                youMayLike = modify?.map((item) => ({
                    name: item?.node?.name,
                    image: item?.node?.thumbnail?.url,
                    price: item?.node?.pricing?.priceRange ? item?.node?.pricing?.priceRange?.start?.gross?.amount : 0,
                }));
            }
        }

        const att = attributesData
            .map((attr) => {
                const selectedValues = selectedAttributes[attr?.attribute?.id] || [];
                return selectedValues.length > 0
                    ? {
                          id: attr?.attribute?.id,
                          values: selectedValues,
                          name: attr?.attribute?.name || null,
                      }
                    : null;
            })
            .filter(Boolean);

        const attributes = att;

        const idSet = new Set(selectedCat.map((item) => item.value));
        let parentCat = '';
        let relateProducts = [];

        // Step 2: Filter objects from the first array
        const result = parentList?.categories?.edges.filter((item) => idSet.has(item.node.id) && item.node.level === 0).map((item) => item.node);

        if (result?.length > 0) {
            parentCat = result[0]?.id;
            const res = await relatedProductsRefetch({
                channel: 'india-channel',
                id: parentCat,
            });

            const response = res?.data?.category?.products?.edges;
            const filter = response?.filter((item) => item?.node?.id !== id);
            if (filter.length > 0) {
                relateProducts = filter?.map((item) => ({
                    name: item?.node?.name,
                    image: item?.node?.thumbnail?.url,
                    price: item?.node?.pricing?.priceRange ? item?.node?.pricing?.priceRange?.start?.gross?.amount : 0,
                }));
            }
        }
        let img = [];
        if (images?.length > 0) {
            img = images?.filter((item) => !item.url.endsWith('.mp4'));
        }

        let brand = null;
        if (selectedBrand) {
            const res = await getBrand({
                id: selectedBrand?.value,
            });
            brand = res?.data?.brand;
        }

        let sizeguide = null;
        if (selectedSizeGuide) {
            const res = await getSizeGuide({
                id: selectedSizeGuide?.value,
            });
            sizeguide = res?.data?.sizeGuid;
        }

        let minPrice = null;
        let maxPrice = null;
        if (variants.length > 1) {
            const prices = variants.map((product) => product.salePrice);
             minPrice = Math.min(...prices); 
             maxPrice = Math.max(...prices);
        }

        const data = {
            name: productName,
            slug,
            seoTittle,
            seoDesc,
            shortDescription,
            description: savedContent,
            category: selectedCat,
            variants,
            minPrice:minPrice,
            maxPrice:maxPrice,
            collection: selectedCollection,
            tags: selectedTag,
            upsell: selectedUpsell,
            crossell: selectedCrosssell,
            publish,
            attributes,
            menuOrder,
            label,
            image: img,
            productId: id,
            relateProducts,
            youMayLike,
            priceBreakup: tableHtml,
            brand: brand,
            sizeguide: sizeguide,
        };
        setPreviewData(data);
        setIsOpenPreview(true);
        setPreviewLoading(false);

        console.log('data', data);
    };

    const handleClickImage = async (item) => {
        const res = await getListRefetch({
            fileurl: item.node.fileUrl,
        });

        const result = res.data?.fileByFileurl;
        if (result) {
            setSelectedImg(result?.fileUrl);
            setAlt(result?.alt);
            setTitle(result?.title);
            setDescription(result?.description);
            setCaption(result?.caption);
            setMediaData({ size: `${parseFloat(result?.size)?.toFixed(2)}`, lastModified: item.LastModified });
        }
    };

    const updateMediaMetaData = async () => {
        try {
            const fileType = await getFileType(selectedImg);
            console.log('fileType: ', fileType);

            const res = await updateImages({
                variables: {
                    file_url: selectedImg,
                    input: {
                        fileUrl: selectedImg,
                        fileType: fileType,
                        alt: alt,
                        description: mediaDescription,
                        caption: caption,
                        title: title,
                    },
                },
            });
            Success('File updated successfully');

            console.log('res: ', res);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const searchMediaByName = async (e) => {
        setMediaSearch(e);
        try {
            if (e !== null && e !== '' && e !== undefined) {
                fetchNextPage(commonInput(null, monthNumber, e));
            } else {
                fetchNextPage(commonInput(null, monthNumber, ''));
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    useEffect(() => {
        filterByType();
    }, [monthNumber]);

    const filterByType = async () => {
        fetchNextPage(commonInput(null, monthNumber, mediaSearch));
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

    const commonInput = (after, month, name) => {
        const input = {
            variables: {
                first: PAGE_SIZE,
                after,
                fileType: mediaType == 'all' ? '' : mediaType,
                month: month,
                year: 2025,
                name,
            },
        };
        return input;
    };

    const filterMediaByMonth = async (value: any) => {
        setMediaMonth(value);
        const res = getMonthNumber(value);
        setMonthNumber(res);
    };

    const productRefresh = async () => {
        try {
            const { data } = await refreshfetch({
                channel: 'india-channel',
                first: PAGE_SIZE,
                after: null,
                search: '',
            });
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const updateProductLoader = () => {
        let loading = true;
        if (!updateProductLoad && !updateChannelLoad && !updateMediaReorderLoad && !createVariantLoad && !updateVariantListLoad && !updatemedaLoad && !updateVariantLoad) {
            loading = false;
        }
        return loading;
    };

    const tableData = (columns, rows) => {
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
        setTableHtml(tableHTML);
        setColumns(columns);
        SetRows(rows);
        Success('Price Breakup submitted!');
    };

    return (
        <div>
            <div className="  mt-6">
                <div className="panel mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">Edit Product</h5>

                    <div className="flex ltr:ml-auto rtl:mr-auto">
                        <button type="button" className="btn btn-primary" onClick={() => window.open('/apps/product/add', '_blank')}>
                            + Create
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    <div className="  col-span-12 md:col-span-8">
                        <div className="panel mb-5">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Product Name
                            </label>
                            <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Enter Your Name" name="name" className="form-input" required />
                            {productNameErrMsg && <p className="error-message mt-1 text-red-500">{productNameErrMsg}</p>}
                        </div>
                        <div className="panel mb-5">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Slug
                            </label>
                            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Enter slug" name="name" className="form-input" required />
                            {slugErrMsg && <p className="error-message mt-1 text-red-500 ">{slugErrMsg}</p>}
                        </div>
                        <div className="panel mb-5">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                SEO
                            </label>
                            <input type="text" value={seoTittle} onChange={(e) => setSeoTittle(e.target.value)} placeholder="Enter title" name="name" className="form-input" required />
                            {seoTittleErrMsg && <p className="error-message mt-1 text-red-500 ">{seoTittleErrMsg}</p>}

                            <textarea
                                id="ctnTextarea"
                                value={seoDesc}
                                onChange={(e) => setSeoDesc(e.target.value)}
                                rows={3}
                                className="form-textarea mt-5"
                                placeholder="Enter Description"
                                required
                            ></textarea>
                            {seoDescErrMsg && <p className="error-message mt-1 text-red-500 ">{seoDescErrMsg}</p>}

                            <div className=" mt-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Keyword
                                </label>
                                <div className="">
                                    <textarea id="ctnTextarea" value={keyword} onChange={(e) => setKeyword(e.target.value)} rows={3} className="form-textarea " placeholder="Enter Keyword"></textarea>
                                </div>
                            </div>
                        </div>
                        {/* <div className="panel mb-5">
                            <label htmlFor="editor" className="block text-sm font-medium text-gray-700">
                                Product description
                            </label>
                            <ReactQuill id="editor" theme="snow" value={value} onChange={setValue} />
                        </div> */}

                        <div className="panel mb-5 mt-5">
                            <label htmlFor="editor" className="block text-sm font-medium text-gray-700">
                                Product Short description
                            </label>
                            <textarea
                                id="ctnTextarea"
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                                rows={3}
                                className="form-textarea"
                                placeholder="Enter Short Description"
                                required
                            ></textarea>
                            {shortDesErrMsg && <p className="error-message mt-1 text-red-500 ">{shortDesErrMsg}</p>}
                        </div>
                        <div className="panel mb-5">
                            <label htmlFor="editor" className="block text-sm font-medium text-gray-700">
                                Product description
                            </label>
                            {/* <textarea
                                id="ctnTextarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                className="form-textarea mt-5"
                                placeholder="Enter Description"
                                required
                            ></textarea> */}
                            {/* {seoDescErrMsg && <p className="error-message mt-1 text-red-500 ">{seoDescErrMsg}</p>} */}
                            <div className="" style={{ height: '250px', overflow: 'scroll' }}>
                                <div ref={editorRef} className="border border-r-8 border-gray-200"></div>
                            </div>
                            {descriptionErrMsg && <p className="error-message mt-1 text-red-500 ">{descriptionErrMsg}</p>}
                        </div>
                        <div className="panel mb-5 mt-5">
                            <label htmlFor="editor" className="block text-sm font-medium text-gray-700">
                                Price Breakup
                            </label>
                            <DynamicSizeTable tableData={tableData} htmlTableString={tableHtml} />
                            {priceBreakUpError && <p className="error-message mt-1 text-red-500 ">{priceBreakUpError}</p>}
                        </div>
                        <div className="panel mb-5 ">
                            {/* <div className="mb-5 flex flex-col border-b border-gray-200 pb-5 pl-10 sm:flex-row">
                                <label htmlFor="name" className="mt-2 block  pr-5 text-sm font-semibold text-gray-700">
                                    Product Data
                                </label>
                                <select className="form-select" style={{ width: '200px' }}>
                                    <option value="1">Simple Product</option>
                                    <option value="2">Variable Product</option>
                                </select>
                            </div> */}
                            <div className="flex flex-col  md:flex-row">
                                {isMounted && (
                                    <Tab.Group>
                                        <div className="mb-5 sm:mb-0 md:me-10 ">
                                            <Tab.List className="w-100 mb-5 flex flex-row overflow-x-scroll text-center font-semibold  md:m-auto md:mb-0 md:w-32 md:flex-col ">
                                                {/* <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? '!bg-primary text-white !outline-none hover:text-white' : ''}
                                                        relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:h-[80%] ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px] dark:border-[#191e3a]`}
                                                        >
                                                            General
                                                        </button>
                                                    )}
                                                </Tab> */}

                                                {/* <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? '!bg-primary text-white !outline-none hover:text-white' : ''}
                                                        relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:h-[80%] ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px] dark:border-[#191e3a]`}
                                                        >
                                                            Linked Products
                                                        </button>
                                                    )}
                                                </Tab> */}
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? '!bg-primary text-white !outline-none hover:text-white' : ''}
                                                        relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:h-[80%] dark:border-[#191e3a] ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px]`}
                                                        >
                                                            Variants
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? '!bg-primary text-white !outline-none hover:text-white' : ''}
                                                        relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:h-[80%] dark:border-[#191e3a] ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px]`}
                                                        >
                                                            Attributes
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? '!bg-primary text-white !outline-none hover:text-white' : ''}
                                                        relative -mb-[1px] block w-full border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:h-[80%] dark:border-[#191e3a] ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px]`}
                                                        >
                                                            Advanced
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? '!bg-primary text-white !outline-none hover:text-white' : ''}
                                                        relative -mb-[1px] block w-full border-white-light p-3.5 py-2 before:absolute before:bottom-0 before:top-0 before:m-auto before:inline-block before:h-0 before:w-[1px] before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:h-[80%] dark:border-[#191e3a] ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px]`}
                                                        >
                                                            Linked Products
                                                        </button>
                                                    )}
                                                </Tab>
                                            </Tab.List>
                                        </div>
                                        <Tab.Panels className="w-full">
                                            {/* <Tab.Panel>
                                                <div className="active flex items-center">
                                                    <div className="mb-5 mr-4 pr-6">
                                                        <label htmlFor="upsells" className="block pr-5 text-sm font-medium text-gray-700">
                                                            Upsells
                                                        </label>
                                                    </div>
                                                    <div className="mb-5" style={{ width: '100%' }}>
                                                        <Select placeholder="Select an option" options={options} isMulti isSearchable={true} />
                                                    </div>
                                                </div>

                                                <div className="active flex items-center">
                                                    <div className="mb-5 mr-4">
                                                        <label htmlFor="cross-sells" className="block pr-5 text-sm font-medium text-gray-700">
                                                            Cross-sells
                                                        </label>
                                                    </div>
                                                    <div className="mb-5" style={{ width: '100%' }}>
                                                        <Select placeholder="Select an option" options={options} isMulti isSearchable={false} />
                                                    </div>
                                                </div>
                                            </Tab.Panel> */}
                                            <Tab.Panel>
                                                {variants?.map((item, index) => {
                                                    return (
                                                        <div key={index} className="mb-5 border-b border-gray-200">
                                                            {index !== 0 && ( // Render remove button only for items after the first one
                                                                <div className="active mb-4 flex items-center justify-end text-danger">
                                                                    <button onClick={() => handleRemoveVariants(item, index)}>
                                                                        <IconTrashLines />
                                                                    </button>
                                                                </div>
                                                            )}
                                                            <div className="active mb-3 grid grid-cols-12 items-center">
                                                                <div
                                                                    className="col-span-12 mb-2 mr-4 md:col-span-3"
                                                                    // style={{ width: '20%' }}
                                                                >
                                                                    <label htmlFor={`name${index}`} className="block pr-5 text-sm font-medium text-gray-700">
                                                                        Variant
                                                                    </label>
                                                                </div>
                                                                <div
                                                                    className="col-span-12 mb-2 md:col-span-9"
                                                                    //  style={{ width: '80%' }}
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        id={`name${index}`}
                                                                        name={`name${index}`}
                                                                        value={item.name}
                                                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                                                        style={{ width: '100%' }}
                                                                        placeholder="Enter variants"
                                                                        className="form-input"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="active mb-3 grid grid-cols-12 items-center">
                                                                <div
                                                                    className="col-span-12 mb-2 mr-4 md:col-span-3"
                                                                    // style={{ width: '20%' }}
                                                                >
                                                                    <label htmlFor={`sku_${index}`} className="block pr-5 text-sm font-medium text-gray-700">
                                                                        SKU
                                                                    </label>
                                                                </div>
                                                                <div
                                                                    className="col-span-12 mb-2 md:col-span-9"
                                                                    // style={{ width: '80%' }}
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        id={`sku_${index}`}
                                                                        name={`sku_${index}`}
                                                                        value={item.sku}
                                                                        onChange={(e) => handleChange(index, 'sku', e.target.value)}
                                                                        style={{ width: '100%' }}
                                                                        placeholder="Enter SKU"
                                                                        className="form-input"
                                                                    />
                                                                    {variantErrors[index]?.sku && <p className="error-message mt-1 text-red-500">{variantErrors[index].sku}</p>}

                                                                    {/* {skuErrMsg && <p className="error-message mt-1 text-red-500 ">{skuErrMsg}</p>} */}
                                                                </div>
                                                            </div>
                                                            <div className="active mb-3 grid grid-cols-12  items-center">
                                                                <div
                                                                    className="col-span-12 mb-2  mr-4 xl:col-span-3"
                                                                    // style={{ width: '20%' }}
                                                                >
                                                                    <label htmlFor={`stackMgmt_${index}`} className="block  text-sm font-medium text-gray-700">
                                                                        Stock Management
                                                                    </label>
                                                                </div>
                                                                <div
                                                                    className="col-span-12 mb-2 xl:col-span-9"
                                                                    // style={{ width: '80%' }}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`stackMgmt_${index}`}
                                                                        name={`stackMgmt_${index}`}
                                                                        checked={item.stackMgmt}
                                                                        onChange={(e) => handleChange(index, 'stackMgmt', e.target.checked)}
                                                                        className="form-checkbox"
                                                                    />
                                                                    <span>Track stock quantity for this product</span>
                                                                    {variantErrors[index]?.stackMgmt && <p className="error-message mt-1 text-red-500">{variantErrors[index].stackMgmt}</p>}
                                                                </div>
                                                            </div>
                                                            {/* {item.stackMgmt && ( */}
                                                            <div className="active mb-3 grid grid-cols-12  items-center">
                                                                <div
                                                                    className="col-span-12 mb-2  mr-4 md:col-span-3"
                                                                    // style={{ width: '20%' }}
                                                                >
                                                                    <label htmlFor={`quantity_${index}`} className="block  text-sm font-medium text-gray-700">
                                                                        Quantity
                                                                    </label>
                                                                </div>
                                                                <div
                                                                    className="col-span-12 mb-2 md:col-span-9"
                                                                    //  style={{ width: '80%' }}
                                                                >
                                                                    <input
                                                                        type="number"
                                                                        id={`quantity_${index}`}
                                                                        name={`quantity_${index}`}
                                                                        value={item?.quantity}
                                                                        onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value))}
                                                                        style={{ width: '100%' }}
                                                                        placeholder="Enter Quantity"
                                                                        className="form-input"
                                                                    />
                                                                    {variantErrors[index]?.quantity && <p className="error-message mt-1 text-red-500">{variantErrors[index].quantity}</p>}
                                                                </div>
                                                            </div>
                                                            {/* )} */}
                                                            <div className="active mb-2 grid grid-cols-12 items-center">
                                                                <div
                                                                    className="col-span-12 mb-2 mr-4 md:col-span-3"
                                                                    // style={{ width: '20%' }}
                                                                >
                                                                    <label htmlFor={`regularPrice_${index}`} className="block pr-5 text-sm font-medium text-gray-700">
                                                                        Regular Price
                                                                    </label>
                                                                </div>
                                                                <div
                                                                    className="col-span-12 mb-2 md:col-span-9"
                                                                    // style={{ width: '80%' }}
                                                                >
                                                                    <input
                                                                        type="number"
                                                                        id={`regularPrice_${index}`}
                                                                        name={`regularPrice_${index}`}
                                                                        value={item.regularPrice}
                                                                        onChange={(e) => handleChange(index, 'regularPrice', parseFloat(e.target.value))}
                                                                        style={{ width: '100%' }}
                                                                        placeholder="Enter Regular Price"
                                                                        className="form-input"
                                                                    />
                                                                    {variantErrors[index]?.regularPrice && <p className="error-message mt-1 text-red-500">{variantErrors[index].regularPrice}</p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <div className="mb-5">
                                                    <button type="button" className=" btn btn-primary flex justify-end" onClick={handleAddItem}>
                                                        Add item
                                                    </button>
                                                </div>
                                            </Tab.Panel>

                                            <Tab.Panel>
                                                {/* <div className="active flex ">
                                                    <div className="mb-5 pr-3" style={{ width: '50%' }}>
                                                        <Select
                                                            placeholder="Select Type"
                                                            options={optionsVal.filter((option: any) => !selectedArr?.includes(option.value))}
                                                            onChange={(selectedOption: any) => handleDropdownChange(selectedOption, selectedOption.value)}
                                                            value={chooseType ? optionsVal.find((option) => option.value === chooseType) : null}

                                                            // value={options?.find((option) => option?.value === chooseType)} // Set the value of the selected type
                                                        />
                                                        {attDropDownError && <p className="error-message  text-red-500">{attDropDownError}</p>}
                                                    </div>
                                                    <div className="mb-5">
                                                        <button type="button" className="btn btn-outline-primary" onClick={handleAddAccordion}>
                                                            Add
                                                        </button>
                                                    </div>
                                                </div> */}

                                                <div className="mb-5">
                                                    <div className="space-y-2 font-semibold">
                                                        {attributesData?.map((attr, index) => (
                                                            <div className="rounded border border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                                <button
                                                                    type="button"
                                                                    className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] ${active === '1' ? '!text-primary' : ''}`}
                                                                    // onClick={() => togglePara('1')}
                                                                >
                                                                    {capitalizeFLetter(attr.attribute.name)}
                                                                    {/* <button onClick={() => handleRemoveAccordion(item.type)}>Remove</button> */}

                                                                    {/* <div className={`text-red-400 ltr:ml-auto rtl:mr-auto `} onClick={() => handleRemoveAccordion(item.type)}>
                                                                        <IconTrashLines />
                                                                    </div> */}
                                                                </button>
                                                                <div>
                                                                    <AnimateHeight duration={300} height={active === '1' ? 'auto' : 0}>
                                                                        <div className=" gap-4 border-t border-[#d3d3d3] p-4 text-[13px] dark:border-[#1b2e4b]">
                                                                            {/* <div className="col-span-4">
                                                                                <p>
                                                                                    Name:
                                                                                    <br /> <span className="font-semibold">{item.type}</span>
                                                                                </p>
                                                                            </div> */}
                                                                            <div className="w-full">
                                                                                <div className="active ">
                                                                                    <div className=" mr-4 ">
                                                                                        <label htmlFor="value" className="block pr-5 text-sm font-medium text-gray-700">
                                                                                            Value(s)
                                                                                        </label>
                                                                                    </div>
                                                                                    <div className="mb-5" style={{ width: '100%' }}>
                                                                                        {/* <Select
                                                                                            placeholder={`Select ${item.type} Name`}
                                                                                            options={item[`${item.type}Name`]}
                                                                                            onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, item.type)}
                                                                                            isMulti
                                                                                            isSearchable={false}
                                                                                            value={(selectedValues[item.type] || []).map((value) => ({ value, label: value }))}
                                                                                        /> */}
                                                                                        {/* <Select
                                                                                            placeholder={`Select ${item.type} Name`}
                                                                                            options={item[`${item.type}Name`]}
                                                                                            onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, item.type)}
                                                                                            isMulti
                                                                                            isSearchable={true}
                                                                                            value={(selectedValues[item.type] || []).map((value: any) => {
                                                                                                const options = item[`${item.type}Name`];
                                                                                                const option = options ? options.find((option: any) => option.value === value) : null;
                                                                                                return option ? { value: option.value, label: option.label } : null;
                                                                                            })}
                                                                                        /> */}
                                                                                        {/* <Select
                                                                                            isMulti
                                                                                            options={attr.attribute.choices.edges.map((edge) => ({
                                                                                                value: edge.node.id,
                                                                                                label: edge.node.name,
                                                                                                slug: edge.node.slug,
                                                                                            }))}
                                                                                            value={selectedValues} 
                                                                                            onChange={(selectedOptions) => handleSelectChange(attr.attribute.id, selectedOptions)}
                                                                                            placeholder={`Select ${capitalizeFLetter(attr.attribute.name)}`}
                                                                                        /> */}

                                                                                        {/* <Select
                                                                                            isMulti
                                                                                            options={attr?.attribute?.choices?.edges?.map((edge) => ({
                                                                                                value: edge?.node?.id,
                                                                                                label: edge?.node?.name,
                                                                                                slug: edge?.node?.slug,
                                                                                            }))}
                                                                                            // Set initial value from selectedAttributes state
                                                                                            value={selectedAttributes[attr.attribute.id]?.map((selectedSlug) => {
                                                                                                const option = attr?.attribute?.choices?.edges?.find((edge) => edge?.node?.slug === selectedSlug);
                                                                                                return option ? { value: option?.node.id, label: option?.node?.name } : null;
                                                                                            })}
                                                                                            onChange={(selectedOptions) => handleSelectChange(attr.attribute.id, selectedOptions)}
                                                                                            placeholder={`Select ${capitalizeFLetter(attr.attribute.name)}`}
                                                                                        /> */}

                                                                                        <Select
                                                                                            isMulti
                                                                                            options={attr?.attribute?.choices?.edges?.map((edge) => ({
                                                                                                value: edge?.node?.id,
                                                                                                label: edge?.node?.name,
                                                                                                slug: edge?.node?.slug, // Include slug
                                                                                            }))}
                                                                                            value={selectedAttributes[attr.attribute.id]?.map((selectedSlug) => {
                                                                                                const option = attr?.attribute?.choices?.edges?.find((edge) => edge?.node?.slug === selectedSlug);
                                                                                                return option ? { value: option?.node.id, label: option?.node?.name, slug: option?.node?.slug } : null;
                                                                                            })}
                                                                                            onChange={(selectedOptions) => handleSelectChange(attr.attribute.id, selectedOptions)}
                                                                                            placeholder={`Select ${capitalizeFLetter(attr.attribute.name)}`}
                                                                                        />
                                                                                        {/* {attributeError[item.type] && <p className="error-message mt-1 text-red-500">{attributeError[item.type]}</p>} */}

                                                                                        {/* <Select placeholder="Select an option" options={options} isMulti isSearchable={false} /> */}
                                                                                        {/* <div className="flex justify-between">
                                                                                        <div className="flex">
                                                                                            <button type="button" className="btn btn-outline-primary btn-sm mr-2 mt-1">
                                                                                                Select All
                                                                                            </button>
                                                                                            <button type="button" className="btn btn-outline-primary btn-sm mt-1">
                                                                                                Select None
                                                                                            </button>
                                                                                        </div>
                                                                                        <div>
                                                                                            <button type="button" className="btn btn-outline-primary btn-sm mt-1">
                                                                                                Create Value
                                                                                            </button>
                                                                                        </div>
                                                                                    </div> */}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </AnimateHeight>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* <div>
                                                    <button type="button" className="btn btn-primary">
                                                        Save Attributes
                                                    </button>
                                                </div> */}
                                            </Tab.Panel>

                                            <Tab.Panel>
                                                <div>
                                                    <div className="active flex items-center">
                                                        <div className="mb-5 mr-4 pr-3" style={{ width: '20%' }}>
                                                            <label htmlFor="regularPrice" className="block pr-5 text-sm font-medium text-gray-700">
                                                                Menu Order
                                                            </label>
                                                        </div>
                                                        <div className="mb-5" style={{ width: '80%' }}>
                                                            <input
                                                                type="number"
                                                                style={{ width: '100%' }}
                                                                value={menuOrder}
                                                                // onChange={(e: any) => setMenuOrder(e.target.value)}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    setMenuOrder(value === '' ? null : value);
                                                                }}
                                                                placeholder="Enter Menu Order"
                                                                name="regularPrice"
                                                                className="form-input"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab.Panel>

                                            <Tab.Panel>
                                                <div className="active flex items-center justify-between ">
                                                    <div className="mb-5 mr-4 pr-6">
                                                        <label htmlFor="upsells" className="block pr-5 text-sm font-medium text-gray-700">
                                                            Upsells
                                                        </label>
                                                    </div>
                                                    <div className="mb-5" style={{ width: '100%' }}>
                                                        <Select
                                                            placeholder="Select an option"
                                                            value={selectedUpsell}
                                                            options={productListUpsell}
                                                            onChange={(e: any) => setSelectedUpsell(e)}
                                                            isMulti
                                                            isSearchable={true}
                                                            onInputChange={(inputValue) => setSearchUpsells(inputValue)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="active flex items-center justify-between">
                                                    <div className="mb-5 mr-4 pr-6">
                                                        <label htmlFor="cross-sells" className="block pr-5 text-sm font-medium text-gray-700">
                                                            Cross-sells
                                                        </label>
                                                    </div>
                                                    <div className="mb-5 w-full">
                                                        <Select
                                                            placeholder="Select an option"
                                                            value={selectedCrosssell}
                                                            options={productListCrossell}
                                                            onChange={(e: any) => setSelectedCrosssell(e)}
                                                            isMulti
                                                            isSearchable={true}
                                                            onInputChange={(inputValue) => setSearchCrossell(inputValue)}
                                                        />
                                                    </div>
                                                </div>
                                            </Tab.Panel>
                                        </Tab.Panels>
                                    </Tab.Group>
                                )}
                            </div>
                        </div>
                        {/* <div className="panel mt-5">
                            <div className="mb-5 border-b border-gray-200 pb-2">
                                <h5 className=" block text-lg font-medium text-gray-700">Collections</h5>
                            </div>
                            <div className="mb-5">
                                <Select placeholder="Select an collection" options={collectionList} value={selectedCollection} onChange={selectedCollections} isMulti isSearchable={true} />
                            </div>
                        </div> */}
                        <div className="panel mt-5">
                            <div className="mb-5 border-b border-gray-200 pb-2">
                                <h5 className=" block text-lg font-medium text-gray-700">Label</h5>
                            </div>
                            <div className="mb-5">
                                <Select placeholder="Select an label" options={options} value={label} onChange={(val) => setLabel(val)} isSearchable={true} />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        <div className="panel order-4 md:order-1">
                            <div className="mb-5 border-b border-gray-200 pb-2">
                                <h5 className=" block text-lg font-medium text-gray-700">Publish</h5>
                            </div>

                            <div className="active flex items-center">
                                <div className="mb-5 w-full pr-3">
                                    <select className="form-select  flex-1 " value={publish} onChange={(e) => setPublish(e.target.value)}>
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <button type="submit" className="btn btn-primary w-full " onClick={() => updateProducts()}>
                                    {updateProductLoader() ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Update'}
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-outline-primary w-full"
                                    onClick={() => {
                                        previewClick();
                                    }}
                                >
                                    {previewLoading ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Preview'}
                                </button>
                            </div>
                        </div>

                        <div className="panel mt-5">
                            <div className="mb-5 border-b border-gray-200 pb-2">
                                <h5 className=" block text-lg font-medium text-gray-700">Product Gallery</h5>
                            </div>

                            <div className="grid grid-cols-12 gap-3">
                                {images?.map((item: any, index: any) => (
                                    <>
                                        <div
                                            key={item.id}
                                            className="h-15 w-15 relative col-span-4 overflow-hidden bg-black"
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, item.id, index)}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, index)}
                                        >
                                            {item?.url?.endsWith('.mp4') ? (
                                                <video controls src={item?.url} className="h-full w-full object-cover">
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img src={item?.url} alt="Product image" className=" h-full w-full" />
                                            )}

                                            <button className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white" onClick={() => multiImageDelete(item)}>
                                                <IconTrashLines />
                                            </button>
                                        </div>
                                    </>
                                ))}
                            </div>

                            <p
                                className="mt-5 cursor-pointer text-primary underline"
                                onClick={() => {
                                    setMediaTab(1);
                                    setModal2(true);
                                    setSelectedImg(null);
                                }}
                            >
                                Add product gallery images
                            </p>
                        </div>

                        <div className="panel mt-5">
                            <div className="mb-5 border-b border-gray-200 pb-2">
                                <h5 className=" block text-lg font-medium text-gray-700">Product Categories</h5>
                            </div>
                            <div className="mb-5">
                                {/* <Select isMulti value={selectedCat} onChange={(e) => selectCat(e)} options={categoryList} placeholder="Select categories..." className="form-select" /> */}
                                <CategorySelect
                                    queryFunc={fetchCategories} // Pass the function to fetch categories
                                    selectedCategory={selectedCat} // Use 'selectedCategory' instead of 'value'
                                    onCategoryChange={(data) => setselectedCat(data)} // Use 'onCategoryChange' instead of 'onChange'
                                    placeholder="Select categories"
                                />
                                {categoryErrMsg && <p className="error-message mt-1 text-red-500 ">{categoryErrMsg}</p>}
                            </div>
                        </div>
                        <div className="panel order-4  mt-5 md:order-3">
                            <div className="mb-5 border-b border-gray-200 pb-2">
                                <h5 className=" block text-lg font-medium text-gray-700">Product Brands</h5>
                            </div>
                            <div className="mb-5">
                                <BrandSelect
                                    queryFunc={fetchBrands} // Pass the function to fetch categories
                                    selectedCategory={selectedBrand} // Use 'selectedCategory' instead of 'value'
                                    onCategoryChange={(data) => setselectedBrand(data)} // Use 'onCategoryChange' instead of 'onChange'
                                    placeholder="Select brands"
                                />
                                {/* <Select isMulti value={selectedCat} onChange={(e) => setselectedCat(e)} options={parentLists} placeholder="Select categories..." className="form-select" /> */}
                            </div>
                            {/* <p className="mt-5 cursor-pointer text-primary underline" onClick={() => setIsOpenBrand(true)}>
                                Add a new brand
                            </p> */}
                        </div>

                        <div className="panel order-4  mt-5 md:order-3">
                            <div className="mb-5 border-b border-gray-200 pb-2">
                                <h5 className=" block text-lg font-medium text-gray-700">Product Size Guide</h5>
                            </div>
                            <div className="mb-5">
                                <SizeGuideSelect
                                    queryFunc={fetchSizeGuide} // Pass the function to fetch categories
                                    selectedCategory={selectedSizeGuide} // Use 'selectedCategory' instead of 'value'
                                    onCategoryChange={(data) => setSelectedSizeGuide(data)} // Use 'onCategoryChange' instead of 'onChange'
                                    placeholder="Select size guide"
                                />
                                {/* <Select isMulti value={selectedCat} onChange={(e) => setselectedCat(e)} options={parentLists} placeholder="Select categories..." className="form-select" /> */}

                                {/* {categoryErrMsg && <p className="error-message mt-1 text-red-500 ">{categoryErrMsg}</p>} */}
                            </div>
                        </div>

                        <div className="panel mt-5">
                            <div className="mb-5 border-b border-gray-200 pb-2">
                                <h5 className=" block text-lg font-medium text-gray-700">Product Tags</h5>
                            </div>
                            <div className="mb-5">
                                <TagSelect loading={tagloading} queryFunc={fetchTag} selectedCategory={selectedTag} onCategoryChange={(data) => setSelectedTag(data)} />

                                {/* <Select placeholder="Select an tags" isMulti options={tagList} value={selectedTag} onChange={(data: any) => setSelectedTag(data)} isSearchable={true} /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* product video popup */}
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
                                        <div className="text-lg font-bold">Product gallery video</div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal1(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="m-5">
                                        {isMounted && (
                                            <Tab.Group>
                                                <Tab.List className="mt-3 flex w-44 flex-wrap justify-start space-x-2 border p-1  rtl:space-x-reverse">
                                                    <Tab as={Fragment}>
                                                        {({ selected }) => (
                                                            <button
                                                                className={`${selected ? 'bg-primary text-white !outline-none' : ''}
                                                    ' -mb-[1px] block rounded p-3.5 py-2 hover:bg-primary hover:text-white`}
                                                            >
                                                                MP4
                                                            </button>
                                                        )}
                                                    </Tab>
                                                    <Tab as={Fragment}>
                                                        {({ selected }) => (
                                                            <button
                                                                className={`${selected ? 'bg-primary text-white !outline-none' : ''}
                                                    ' -mb-[1px] block rounded p-3.5 py-2 hover:bg-primary hover:text-white`}
                                                            >
                                                                Youtube
                                                            </button>
                                                        )}
                                                    </Tab>
                                                </Tab.List>
                                                <Tab.Panels>
                                                    <Tab.Panel>
                                                        <div className="active pt-5">
                                                            <label htmlFor="product-gallery-video" className="form-label mb-5 border-b  pb-3 text-gray-600">
                                                                MP4 video file
                                                            </label>
                                                            <input type="file" id="product-gallery-video" className="form-input" />
                                                            <span className="pt-5 text-sm text-gray-600">Upload a new or select (.mp4) video file from the media library.</span>
                                                        </div>
                                                        <button className="btn btn-primary mt-5">Save</button>
                                                    </Tab.Panel>
                                                    <Tab.Panel>
                                                        <div className="active pt-5">
                                                            <label htmlFor="product-gallery-video" className="form-label mb-5 border-b  pb-3 text-gray-600">
                                                                YouTube video URL
                                                            </label>
                                                            <input type="text" id="product-gallery-video" className="form-input" />
                                                            <span className="pt-5 text-sm text-gray-600">Example: https://youtu.be/LXb3EKWsInQ</span>
                                                        </div>
                                                        <button className="btn btn-primary mt-5">Save</button>
                                                    </Tab.Panel>
                                                </Tab.Panels>
                                            </Tab.Group>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* product img popup */}

            <Transition appear show={modal4} as={Fragment}>
                <Dialog as="div" open={modal4} onClose={() => setModal4(false)}>
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
                                    <div className="flex items-center justify-between border-b bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <div className="text-lg font-bold">Product gallery Image</div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal4(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="m-5 pt-5">
                                        {/* Input for selecting file */}
                                        <input type="file" id="product-gallery-image" className="form-input" onChange={multiImgUpload} />

                                        {/* Button to upload */}
                                        {/* <div className="flex justify-end">
                                            <button className="btn btn-primary mt-5" onClick={handleUpload}>
                                                Upload
                                            </button>
                                        </div> */}

                                        {/* Display preview of the selected image */}
                                        {/* {images?.length > 0 &&
                                            images?.map((item, index) => (
                                                <div className="mt-5 bg-[#f0f0f0] p-5">

                                                    <div
                                                        key={item.id}
                                                        className=" relative h-20 w-20 "
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, item.id)}
                                                        onDragOver={handleDragOver}
                                                        onDrop={(e) => handleDrop(e, index)}
                                                    >
                                                        <img src={item?.url} alt="Selected" className="h-full w-full object-cover " />


                                                        <button className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white" onClick={() => multiImageDelete(index)}>
                                                            <IconTrashLines />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))} */}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={modal2} as={Fragment}>
                <Dialog
                    as="div"
                    open={modal2}
                    onClose={() => {
                        setSelectedImg(null);
                        setModal2(false);
                    }}
                >
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] bg-[black]/60">
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
                                <Dialog.Panel className="panel max-w-8xl my-8 w-full overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Media</h5>
                                        <button
                                            onClick={() => {
                                                setModal2(false);
                                                setSelectedImg(null);
                                                setSelectedImages([]);
                                            }}
                                            type="button"
                                            className="text-white-dark hover:text-dark"
                                        >
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="m-5">
                                        <div className="flex justify-between">
                                            <div className="flex gap-5">
                                                <button
                                                    onClick={() => {
                                                        setMediaTab(0);
                                                        setMediaType('all');
                                                        setMediaMonth('all'), setMediaSearch('');
                                                    }}
                                                    className={`${mediaTab == 0 ? 'bg-primary text-white !outline-none' : ''}
                                                    -mb-[1px] flex items-center rounded p-3.5 py-2 before:inline-block `}
                                                >
                                                    Upload Files
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setMediaTab(1);
                                                        setMediaType('all');
                                                        setMediaMonth('all'), setMediaSearch('');
                                                    }}
                                                    className={`${mediaTab == 1 ? 'bg-primary text-white !outline-none' : ''}
                                                    -mb-[1px] flex items-center rounded p-3.5 py-2 before:inline-block `}
                                                >
                                                    Media Library
                                                </button>
                                            </div>

                                            <button className="btn btn-primary" onClick={() => newImageAdded()}>
                                                Set Product Image
                                            </button>
                                        </div>

                                        {mediaTab == 0 ? (
                                            loading ? (
                                                <CommonLoader />
                                            ) : (
                                                <div className="active  pt-5">
                                                    <div className="flex h-[500px] items-center justify-center">
                                                        <div className="w-1/2 text-center">
                                                            <h3 className="mb-2 text-xl font-semibold">Upload File</h3>
                                                            <p className="mb-2 text-sm ">or</p>
                                                            {/* <input type="file" className="mb-2 ml-32" /> */}
                                                            <input type="file" className="mb-2 ml-32" onChange={handleFileChange} />

                                                            <p className="mb-2 text-sm">Maximum upload file size: 30 MB.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        ) : loading ? (
                                            <CommonLoader />
                                        ) : (
                                            <>
                                                <div className="grid grid-cols-12 pt-5">
                                                    <div className="h-[500px] col-span-9 overflow-y-scroll border-r border-gray-200 pr-5 md:h-[600px] xl:h-[600px]">
                                                        <div className="flex gap-4">
                                                            <div>
                                                                <div>Filter by type</div>
                                                                <div className="flex justify-between gap-3 pt-3">
                                                                    <div className="flex gap-3">
                                                                        {/* <select className="form-select w-40 flex-1"> */}
                                                                        <select className="form-select w-40 flex-1 xl:w-60" value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
                                                                            <option value="all">All Data</option>
                                                                            <option value="image">Images</option>
                                                                            <option value="video">Videos</option>
                                                                            <option value="doc">Docs</option>

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
                                                                        <select className="form-select w-40 flex-1 xl:w-60" value={mediaMonth} onChange={(e) => filterMediaByMonth(e.target.value)}>
                                                                            {/* <select className="form-select w-40 flex-1" value={mediaDate} onChange={(e) => filterMediaByMonth(e.target.value)}> */}
                                                                            <option value="all">All Data</option>
                                                                            {months.map((month, index) => (
                                                                                <option key={month} value={`${month}/2025`}>{`${month} 2025`}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <input
                                                                            type="text"
                                                                            className="form-input mr-2 w-40 xl:w-60"
                                                                            placeholder="Search..."
                                                                            value={mediaSearch}
                                                                            onChange={(e) => searchMediaByName(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-12 pt-5">
                                                            {mediaImages?.length > 0 ? (
                                                                mediaImages?.map((item) => (
                                                                    <div
                                                                        key={item.node?.fileUrl}
                                                                        className={`col-span-2  overflow-hidden p-2 ${selectedImages.includes(item) ? 'border-4 border-blue-500' : ''}`}
                                                                        onMouseDown={() => handleMouseDown(item)}
                                                                        onMouseUp={handleMouseUp}
                                                                        onMouseLeave={handleMouseLeave}
                                                                        onClick={() => {
                                                                            handleClickImage(item);
                                                                            // deletesImg(item)
                                                                        }}
                                                                    >
                                                                        {item.node?.fileUrl?.endsWith('.mp4') ? (
                                                                            <video controls src={item.node?.fileUrl} className="h-full w-full object-cover">
                                                                                Your browser does not support the video tag.
                                                                            </video>
                                                                        ) : item.node?.fileUrl?.endsWith('.pdf') ? (
                                                                            <Image src={pdf} alt="Loading..." />
                                                                        ) : item.node?.fileUrl?.endsWith('.doc') ? (
                                                                            <Image src={docs} alt="Loading..." />
                                                                        ) : (
                                                                            <img src={item.node?.fileUrl} alt="" className="h-full w-full" />
                                                                        )}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="col-span-6 flex h-64 items-center justify-center">No Data Found</div>
                                                            )}
                                                        </div>
                                                        <div className="mt-5 flex justify-end gap-3">
                                                            <button disabled={!mediaPreviousPage} onClick={handlePreviousPage} className={`btn ${!mediaPreviousPage ? 'btn-disabled' : 'btn-primary'}`}>
                                                                <IconArrowBackward />
                                                            </button>
                                                            <button disabled={!mediaHasNextPage} onClick={handleNextPage} className={`btn ${!mediaHasNextPage ? 'btn-disabled' : 'btn-primary'}`}>
                                                                <IconArrowForward />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {selectedImg && (
                                                        <div className="col-span-3 h-[700px] overflow-y-scroll pl-5">
                                                            {/* <div className="border-b border-gray-200 pb-5"> */}
                                                            <div className="">
                                                                <div>
                                                                    <p className="mb-2 text-lg font-semibold">ATTACHMENT DETAILS</p>
                                                                </div>

                                                                {selectedImg?.endsWith('.mp4') ? (
                                                                    <video controls src={selectedImg} className="h-full w-full object-cover">
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                ) : selectedImg?.endsWith('.pdf') ? (
                                                                    <Image src={pdf} alt="Loading..." />
                                                                ) : selectedImg?.endsWith('.doc') ? (
                                                                    <Image src={docs} alt="Loading..." />
                                                                ) : (
                                                                    <img src={selectedImg} alt="" className="h-full w-full" />
                                                                )}
                                                                {/* {selectedImg?.url?.endsWith('.mp4') ? (
                                                                    <video controls src={selectedImg?.url} className="h-full w-full object-cover" style={{ height: '300px' }}>
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                ) : (
                                                                    <img src={selectedImg.url} alt="" className="h-full w-full" />
                                                                )} */}
                                                                <p className="mt-2 font-semibold">{getKey(selectedImg)}</p>

                                                                <p className="text-sm">{moment(mediaData?.lastModified).format('DD-MM-YYYY')}</p>
                                                                <p className="text-sm">{mediaData?.size} KB</p>

                                                                {/* <p className="text-sm">1707 by 2560 pixels</p> */}
                                                                <a href="#" className="text-danger underline" onClick={() => mediaImageDelete()}>
                                                                    Delete permanently
                                                                </a>
                                                            </div>
                                                            <div className="pr-5">
                                                                <div className="mt-5">
                                                                    <label className="mb-2">Alt Text</label>
                                                                    <textarea className="form-input" placeholder="Enter Alt Text" value={alt} onChange={(e) => setAlt(e.target.value)}></textarea>
                                                                    <span>
                                                                        <a href="#" className="text-primary underline">
                                                                            Learn how to describe the purpose of the image
                                                                        </a>
                                                                        . Leave empty if the image is purely decorative.
                                                                    </span>
                                                                </div>
                                                                <div className="mt-5">
                                                                    <label className="mb-2">Title</label>
                                                                    <input type="text" className="form-input" placeholder="Enter Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                                                                </div>

                                                                <div className="mt-5">
                                                                    <label className="mb-2">Caption</label>
                                                                    <textarea
                                                                        className="form-input"
                                                                        placeholder="Enter Caption"
                                                                        value={caption}
                                                                        onChange={(e) => setCaption(e.target.value)}
                                                                    ></textarea>
                                                                </div>
                                                                <div className="mt-5">
                                                                    <label className="mb-2">Description</label>
                                                                    <textarea
                                                                        className="form-input"
                                                                        placeholder="Enter Caption"
                                                                        value={mediaDescription}
                                                                        onChange={(e) => setMediaDescription(e.target.value)}
                                                                    ></textarea>
                                                                </div>

                                                                <div className="mt-5">
                                                                    <label className="mb-2">File URL</label>
                                                                    <input type="text" className="form-input" placeholder="Enter Title" value={selectedImg} />
                                                                    <button className="btn btn-primary-outline mt-2 text-sm" onClick={handleCopy}>
                                                                        Copy URL to Clipboard
                                                                    </button>
                                                                    {copied ? <label className="mt-2 text-green-500">Copied</label> : <label className="mt-2">Copy Link</label>}
                                                                </div>
                                                                <div className="flex justify-end">
                                                                    <button type="submit" className="btn btn-primary " onClick={() => updateMediaMetaData()}>
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
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* //Preview */}
            <Transition appear show={isOpenPreview} as={Fragment}>
                <Dialog as="div" open={isOpenPreview} onClose={() => setIsOpenPreview(false)}>
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
                                <Dialog.Panel as="div" className="panel my-8 w-[98%] overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark xl:w-[70%]">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <div className="text-lg font-bold">Preview</div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setIsOpenPreview(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="my-4 flex h-full w-full justify-center gap-3">
                                        <div
                                            className=" scrollbar-hide  flex h-[500px] w-1/12 flex-col items-center overflow-scroll rounded-xl p-0"
                                            style={{ overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                        >
                                            {
                                                productPreview?.image?.length > 1 && (
                                                    <div className="overflow-auto">
                                                        {productPreview?.image?.map((item, index) => (
                                                            <div
                                                                key={index}
                                                                className="mb-2 h-auto w-[100%] cursor-pointer overflow-hidden rounded-xl"
                                                                onClick={() => setPreviewSelectedImg(item?.url)}
                                                            >
                                                                <img src={item?.url} alt="image" className="rounded-xl object-contain object-center" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                                //  : (
                                                //     <div className="h-[140px] w-[100%] cursor-pointer overflow-hidden p-2 ">
                                                //         <img src={'/assets/images/placeholder.png'} alt="image" className="object-contain " />
                                                //     </div>
                                                // )
                                            }
                                        </div>
                                        {productPreview?.image?.length > 0 ? (
                                            <div className=" h-[500px] w-4/12 rounded-xl p-0">
                                                <img
                                                    className="rounded-xl"
                                                    src={previewSelectedImg ? previewSelectedImg : productPreview?.image[0]?.url}
                                                    alt="image"
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="panel h-[100%] w-4/12">
                                                <img src={'/assets/images/placeholder.png'} alt="image" style={{ width: '100%', height: '100%' }} />
                                            </div>
                                        )}

                                        <div className=" scrollbar-hide scrollbar-thin h-[500px] w-5/12 overflow-y-scroll">
                                            <div className="mb-3 w-full rounded-lg bg-[#f5f5f5] p-4">
                                                {productPreview?.name && (
                                                    <label htmlFor="name" className="block text-2xl font-medium text-gray-700">
                                                        {productPreview?.name}
                                                    </label>
                                                )}
                                                {productPreview?.variants?.length > 1 ? (
                                                    <div className="flex flex-wrap gap-4">
                                                        
                                                                <label  htmlFor="name" className="block text-2xl font-bold text-[#b4633a]">
                                                                    ₹{addCommasToNumber(productPreview?.minPrice)}  {" "} -
                                                                </label><label  htmlFor="name" className="block text-2xl font-bold text-[#b4633a]">
                                                                    ₹{addCommasToNumber(productPreview?.maxPrice)}
                                                                </label>
                                                           
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap gap-4">
                                                        {/* {productPreview?.variants?.map(
                                                            (item, index) => ( */}

                                                        <label htmlFor="name" className="block text-2xl font-bold text-[#b4633a]">
                                                            ₹{addCommasToNumber(productPreview?.variants[0]?.salePrice)}
                                                        </label>
                                                        {/* )
                                                            
                                                        )} */}
                                                    </div>
                                                )}
                                                {productPreview?.shortDescription && (
                                                    <label htmlFor="name" className="text-md block text-[14px] font-medium text-gray-700">
                                                        {productPreview?.shortDescription}
                                                    </label>
                                                )}
                                            </div>

                                            <div className="mb-3 w-full rounded-lg bg-[#f5f5f5] p-4">
                                                {/* <div>
                                                    {productPreview?.description?.blocks?.length > 0 && (
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <div className={`${productPreview?.description ? 'theme-color' : ''}`}>Product Details</div>
                                                           
                                                        </div>
                                                    )}
                                                    {productPreview?.description && (
                                                        <>
                                                            {productPreview?.description?.blocks?.map((block, index) => (
                                                                <div key={index} style={{ marginTop: '10px' }}>
                                                                    {block?.type === 'header' && <h5 style={{ fontWeight: '400' }}>{block?.data?.text}</h5>}
                                                                    {block.type === 'paragraph' && (
                                                                        <p style={{ color: 'gray', marginBottom: '5px' }}>
                                                                            {block.data.text && (
                                                                                <span
                                                                                    dangerouslySetInnerHTML={{
                                                                                        __html: block.data.text.includes('<b>') ? `<b>${block.data.text}</b>` : block.data.text,
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </p>
                                                                    )}
                                                                    {block.type === 'list' && (
                                                                        <ul style={{ paddingLeft: '20px' }}>
                                                                            {block.data.items?.map((item, itemIndex) => (
                                                                                <li
                                                                                    key={itemIndex}
                                                                                    style={{ color: 'gray' }}
                                                                                    dangerouslySetInnerHTML={{
                                                                                        __html: item.includes('<b>') ? `<b>${item}</b>` : item,
                                                                                    }}
                                                                                />
                                                                            ))}
                                                                        </ul>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                                {productPreview?.attributes?.length > 0 && (
                                                    <div
                                                        style={{
                                                            borderBottom: '1px solid #EAEBED',
                                                            paddingBottom: '15px',
                                                            marginBottom: '15px',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <div>Additional Information</div>
                                                           
                                                        </div>
                                                        <ul
                                                            style={{
                                                                listStyleType: 'none',
                                                                paddingTop: '10px',
                                                             
                                                            }}
                                                        >
                                                            {productPreview?.attributes?.map((key: any) => (
                                                                <div className="flex flex-wrap gap-3" key={key?.id}>
                                                                    <span style={{ fontWeight: 'bold' }}>{key?.name} : </span>
                                                                    {key?.values?.map((item, index) => (
                                                                        <span key={item} style={{ marginRight: '1px', cursor: 'pointer' }}>
                                                                            {item}
                                                                            {index < key?.values?.length - 1 ? ',' : ''}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {productPreview?.priceBreakup && (
                                                    <div
                                                        style={{
                                                            borderBottom: '1px solid #EAEBED',
                                                            paddingBottom: '15px',
                                                            marginBottom: '15px',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <div>About Brand</div>
                                                           
                                                        </div>
                                                        <ul
                                                            style={{
                                                                listStyleType: 'none',
                                                                paddingTop: '10px',
                                                               
                                                            }}
                                                        >
                                                            <div className="flex flex-wrap gap-3" key={productPreview?.brand?.id}>
                                                                <span style={{ fontWeight: 'bold' }}>{productPreview?.brand?.name} </span>

                                                                <p style={{ color: 'gray', marginBottom: '5px' }}>
                                                                    {productPreview?.brand?.description && (
                                                                        <span
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: productPreview?.brand?.description,
                                                                            }}
                                                                        />
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </ul>
                                                    </div>
                                                )}

                                                {productPreview?.priceBreakup && (
                                                    <div
                                                        style={{
                                                            borderBottom: '1px solid #EAEBED',
                                                            paddingBottom: '15px',
                                                            marginBottom: '15px',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <div>Price Breakup</div>
                                                            
                                                        </div>
                                                        <ul
                                                            style={{
                                                                listStyleType: 'none',
                                                                paddingTop: '10px',
                                                                
                                                            }}
                                                        >
                                                            <div className="flex flex-wrap gap-3">
                                                                <div dangerouslySetInnerHTML={{ __html: productPreview?.priceBreakup }}></div>
                                                               
                                                            </div>
                                                        </ul>
                                                    </div>
                                                )} */}

                                                <ProductTabs productPreview={productPreview} />
                                            </div>

                                            <div className="mb-3 w-full rounded-lg bg-[#f5f5f5] p-4">
                                                {productPreview?.variants?.length > 0 && productPreview?.variants[0]?.sku !== '' && (
                                                    <div className="flex flex-wrap gap-3">
                                                        <span className="text-[14px]" style={{ fontWeight: 'bold' }}>
                                                            SKU :{' '}
                                                        </span>
                                                        {productPreview?.variants?.map((item, index) => (
                                                            <span className="text-[14px]" key={item?.value} style={{ cursor: 'pointer', display: 'flex', flexWrap: 'wrap', wordBreak: 'break-word' }}>
                                                                {item?.sku}
                                                                {index < productPreview?.variants?.length - 1 ? ', ' : ''}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {productPreview?.category?.length > 0 && (
                                                    <div className="flex flex-wrap  gap-3 pt-3">
                                                        <span className="text-[14px]" style={{ fontWeight: 'bold' }}>
                                                            Categories :{' '}
                                                        </span>
                                                        {productPreview?.category?.map((item, index) => (
                                                            <span className="text-[14px]" key={item?.value} style={{ marginRight: '3px', cursor: 'pointer' }}>
                                                                {item?.label}
                                                                {index < productPreview?.category?.length - 1 ? ', ' : ''}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {productPreview?.tags?.length > 0 && (
                                                    <div className="flex flex-wrap  gap-3 pt-3">
                                                        <span className="text-[14px]" style={{ fontWeight: 'bold' }}>
                                                            Tags :{' '}
                                                        </span>
                                                        {productPreview?.tags?.map((item, index) => (
                                                            <span className="text-[14px]" key={item?.value} style={{ marginRight: '3px', cursor: 'pointer' }}>
                                                                {item?.label}
                                                                {index < productPreview?.tags?.length - 1 ? ', ' : ''}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {productPreview?.relateProducts?.length > 0 && (
                                        <div className="m-auto mt-8 w-[90%] p-5">
                                            <div className="mb-5  border-b border-gray-200 pb-2">
                                                <h5 className=" block text-lg font-medium text-gray-700">Related Products</h5>
                                            </div>
                                            <div className="flex gap-4 overflow-x-scroll">
                                                {productPreview?.relateProducts?.map((item, index) => (
                                                    <div className=" flex flex-col items-center ">
                                                        <div key={index} className="h-100 w-[200px] cursor-pointer overflow-hidden rounded-xl p-2" onClick={() => setPreviewSelectedImg(item?.url)}>
                                                            {item?.image ? (
                                                                <img src={item?.image} alt="image" className="rounded-xl object-contain" />
                                                            ) : (
                                                                <img src={'/assets/images/placeholder.png'} alt="image" className="rounded-xl object-contain" />
                                                            )}
                                                        </div>
                                                        <div className="w-[200px] text-center">{item?.name}</div>
                                                        <div>₹{addCommasToNumber(item?.price)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {productPreview?.youMayLike?.length > 0 && (
                                        <div className="m-auto w-[90%] p-5">
                                            <div className="mb-5  border-b border-gray-200 pb-2">
                                                <h5 className=" block text-lg font-medium text-gray-700">You May Also Like ..</h5>
                                            </div>
                                            <div className="flex gap-4 overflow-x-scroll">
                                                {productPreview?.youMayLike?.map((item, index) => (
                                                    <div className=" flex flex-col items-center ">
                                                        <div key={index} className="h-100 w-[200px] cursor-pointer overflow-hidden rounded-xl p-2" onClick={() => setPreviewSelectedImg(item?.url)}>
                                                            {item?.image ? (
                                                                <img src={item?.image} alt="image" className="rounded-xl object-contain" />
                                                            ) : (
                                                                <img src={'/assets/images/placeholder.png'} alt="image" className="rounded-xl object-contain" />
                                                            )}
                                                        </div>
                                                        <div className="w-[200px] text-center">{item?.name}</div>
                                                        <div>₹{addCommasToNumber(item?.price)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default PrivateRouter(ProductEdit);
