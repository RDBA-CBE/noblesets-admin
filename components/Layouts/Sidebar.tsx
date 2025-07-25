import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import IconCaretsDown from '@/components/Icon/IconCaretsDown';
import IconMenuDashboard from '@/components/Icon/Menu/IconMenuDashboard';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconMinus from '@/components/Icon/IconMinus';
import IconMenuChat from '@/components/Icon/Menu/IconMenuChat';
import IconMenuMailbox from '@/components/Icon/Menu/IconMenuMailbox';
import IconMenuTodo from '@/components/Icon/Menu/IconMenuTodo';
import IconMenuNotes from '@/components/Icon/Menu/IconMenuNotes';
import IconMenuScrumboard from '@/components/Icon/Menu/IconMenuScrumboard';
import IconMenuContacts from '@/components/Icon/Menu/IconMenuContacts';
import IconMenuInvoice from '@/components/Icon/Menu/IconMenuInvoice';
import IconMenuCalendar from '@/components/Icon/Menu/IconMenuCalendar';
import IconMenuComponents from '@/components/Icon/Menu/IconMenuComponents';
import IconMenuElements from '@/components/Icon/Menu/IconMenuElements';
import IconMenuCharts from '@/components/Icon/Menu/IconMenuCharts';
import IconMenuWidgets from '@/components/Icon/Menu/IconMenuWidgets';
import IconMenuFontIcons from '@/components/Icon/Menu/IconMenuFontIcons';
import IconMenuDragAndDrop from '@/components/Icon/Menu/IconMenuDragAndDrop';
import IconMenuTables from '@/components/Icon/Menu/IconMenuTables';
import IconMenuDatatables from '@/components/Icon/Menu/IconMenuDatatables';
import IconMenuForms from '@/components/Icon/Menu/IconMenuForms';
import IconMenuUsers from '@/components/Icon/Menu/IconMenuUsers';
import IconMenuPages from '@/components/Icon/Menu/IconMenuPages';
import IconMenuAuthentication from '@/components/Icon/Menu/IconMenuAuthentication';
import IconMenuDocumentation from '@/components/Icon/Menu/IconMenuDocumentation';
import IconMicrophoneOff from '../Icon/IconMicrophoneOff';
import IconMenuReport from '../Icon/Menu/IconMenuReport';
import { useMutation, useQuery } from '@apollo/client';
import { LAST_UPDATE_DETAILS, LOW_STOCK_LIST, PRODUCT_CAT_LIST } from '@/query/product';
import { sampleParams } from '@/utils/functions';
import IconAward from '../Icon/IconAward';
import IconPaymentList from '../Icon/IconPayment';
import Image from 'next/image';
import productImage from '@/public/assets/images/products.png';
import OrderImage from '@/public/assets/images/orders.png';
import CustomerImage from '@/public/assets/images/customer.png';
import shippingproviderImage from '@/public/assets/images/shipping-provider.png';
import ReportsImage from '@/public/assets/images/reports.png';
import StockManagementImage from '@/public/assets/images/stock.png';
import PaymentImage from '@/public/assets/images/payments.png';
import MediaImage from '@/public/assets/images/media.png';
import CouponsImage from '@/public/assets/images/coupons.png';
import DiscountImage from '@/public/assets/images/discount.png';
import AbandedCartImage from '@/public/assets/images/abandoned-cart.png';
import DropShippingImage from '@/public/assets/images/shipping-provider.png';

const Sidebar = () => {
    const router = useRouter();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [lowStockCount, setLowStockCount] = useState(0);
    const [lastUpdateCount, setLastUpdateCount] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    const themeConfig = useSelector((state: any) => state.themeConfig);
    const semidark = useSelector((state: any) => state.themeConfig.semidark);
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const { data: productSearch, refetch: lowStockRefetch } = useQuery(LOW_STOCK_LIST);
    const [lastUpdateData] = useMutation(LAST_UPDATE_DETAILS);

    useEffect(() => {
        getLowStockCount();
        lastUpdate();
    }, [router.pathname]);

    useEffect(() => {
        checkIsAdmin();
    }, [router]);

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [router.pathname]);

    const lastUpdate = async () => {
        try {
            const res = await lastUpdateData();
            setLastUpdateCount(res.data?.stockUpdate?.total);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const checkIsAdmin = async () => {
        try {
            const isAdmin = localStorage?.getItem('isAdmin');
            if (isAdmin) {
                const data = JSON.parse(isAdmin);
                setIsAdmin(data);
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const getLowStockCount = async () => {
        try {
            const res = await lowStockRefetch({
                channel: 'india-channel',
                first: 100,
                after: null,
                filter: {
                    categories: [],
                    stockAvailability: 'OUT_OF_STOCK',
                },
            });
            setLowStockCount(res?.data?.products?.totalCount);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[200px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-2 py-3 mb-4">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <img className="w-[100px] ml-[5px] flex-none" src="/assets/images/logo.png" alt="logo" />
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 dark:text-white-light dark:hover:bg-dark-light/10 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-1 py-0 font-semibold">
                            {/* <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                                    <div className="flex items-center">
                                        <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('dashboard')}</span>
                                    </div>

                                    <div className={currentMenu !== 'dashboard' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'dashboard' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/">{t('sales')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/analytics">{t('analytics')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/finance">{t('finance')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/crypto">{t('crypto')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li> */}

                            {/* <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('apps')}</span>
                            </h2> */}

                            <li className="nav-item">
                                <ul>
                                    {/* <li className="nav-item">
                                        <Link href="/apps/category" className="group">
                                            <div className="flex items-center">
                                                <IconMenuMailbox className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Product')}</span>
                                            </div>
                                        </Link>
                                    </li> */}

                                    <li className="menu nav-item">
                                        <button type="button" className={`${currentMenu === 'product' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('products')}>
                                            <div className="flex items-center">
                                                <Link href="#" className="flex items-center">
                                                    {/* <IconMenuMailbox className="shrink-0 group-hover:!text-primary" /> */}
                                                    <Image src={productImage.src} alt="Product" className="h-5 w-5 shrink-0 object-cover group-hover:!text-primary rtl:mr-3" width={20} height={20} />
                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Products')}</span>
                                                </Link>
                                            </div>

                                            <div className={currentMenu !== 'product' ? '-rotate-90 rtl:rotate-90' : ''} >
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={currentMenu === 'products' ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li>
                                                    <Link href="/">{t('All Products')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/apps/product/add" target="_blank">
                                                        {t('Add New')}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/product/category">{t('Categories')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/product/tags">{t('Tags')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/product/attributes">{t('Attributes')}</Link>
                                                </li>

                                                <li>
                                                    <Link href="/product/brand">{t('Brands')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/apps/sizeGuide/sizeGuide">{t('Size Guide')}</Link>
                                                </li>
                                                {isAdmin && (
                                                    <li>
                                                        <Link href="/product/reviews">{t('Reviews')}</Link>
                                                    </li>
                                                )}
                                                <li>
                                                    <Link href="/apps/pincode" >
                                                        {t('Pincode')}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/apps/custom_reports" >
                                                        {t('Custom Products')}
                                                    </Link>
                                                </li>
                                                {/* <li>
                                                    <Link href="/apps/tax" target="_blank">
                                                        {t('Tax')}
                                                    </Link>
                                                </li> */}
                                                {/* <li>
                                                    <Link href="/product/warehouse">{t('Warehouse')}</Link>
                                                </li> */}
                                                {/* 
                                                <li>
                                                    <Link href="/product/channel">{t('Channels')}</Link>
                                                </li> */}
                                                {/* <li>
                                                    <button type="button" onClick={() => setMenuOpen(!menuOpen)}>
                                                        <div className="flex items-center">
                                                            <span className="pr-5 text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Attributes')}</span>
                                                        </div>

                                                        <div className={menuOpen !== true ? '-rotate-90 rtl:rotate-90' : ''}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button> */}
                                                {/* <Link href="#" onClick={() => setMenuOpen(!menuOpen)}>
                                                        {t('Attributes')}
                                                    </Link> */}
                                                {/* {menuOpen && (
                                                        <ul>
                                                            <li>
                                                                <Link href="/product/finish">{t('Finishes')}</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/product/style">{t('Styles')}</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/product/design">{t('Designs')}</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/product/stone">{t('Stone Types')}</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/product/stoneColor">{t('Stone Colors')}</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/product/type">{t('Types')}</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/product/size">{t('Sizes')}</Link>
                                                            </li>
                                                        </ul>
                                                    )} */}
                                                {/* </li> */}
                                            </ul>
                                        </AnimateHeight>
                                    </li>
                                    {/* <li className="nav-item">
                                        <Link href="/apps/product" className="group">
                                            <div className="flex items-center">
                                                <IconMenuInvoice className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Product')}</span>
                                            </div>
                                        </Link>
                                    </li> */}
                                    {isAdmin && (
                                        <>
                                            <li className="nav-item">
                                                <Link href="/orders/orders" className="group">
                                                    <div className="flex items-center">
                                                        {/* <IconMenuChat className="shrink-0 group-hover:!text-primary" /> */}
                                                        <Image src={OrderImage.src} alt="Order" className="h-5 w-5 shrink-0 object-cover group-hover:!text-primary rtl:mr-3" width={20} height={20} />
                                                        <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Orders')}</span>
                                                    </div>
                                                </Link>
                                            </li>

                                            <li className="nav-item">
                                                <Link href="/customer/customer" className="group">
                                                    <div className="flex items-center">
                                                        {/* <IconMenuChat className="shrink-0 group-hover:!text-primary" /> */}
                                                        <Image
                                                            src={CustomerImage.src}
                                                            alt="Customer"
                                                            className="h-5 w-5 shrink-0 object-cover group-hover:!text-primary rtl:mr-3"
                                                            width={20}
                                                            height={20}
                                                        />
                                                        <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Customers')}</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        </>
                                    )}

                                    {/* <li className="nav-item">
                                        <Link href="/shipping/shippingprovider" className="group">
                                            <div className="flex items-center">
                                                <IconMenuUsers className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Gift cart')}</span>
                                            </div>
                                        </Link>
                                    </li> */}

                                    <li className="nav-item">
                                        <Link href="/shipping/shippingprovider" className="group">
                                            <div className="flex items-center">
                                                {/* <IconMenuUsers className="shrink-0 group-hover:!text-primary" /> */}
                                                <Image
                                                    src={shippingproviderImage.src}
                                                    alt="Shipping"
                                                    className="h-5 w-5 shrink-0 object-cover group-hover:!text-primary rtl:mr-3"
                                                    width={20}
                                                    height={20}
                                                />
                                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Shipping Providers')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    {isAdmin && (
                                        <li className="nav-item">
                                            <Link href="/reports" className="group">
                                                <div className="flex items-center">
                                                    {/* <IconMenuReport className="shrink-0 group-hover:!text-primary" /> */}
                                                    <Image src={ReportsImage.src} alt="Reports" className="h-5 w-5 shrink-0 object-cover group-hover:!text-primary rtl:mr-3" width={20} height={20} />
                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Reports')}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    )}
                                    <li className="menu nav-item">
                                        <button type="button" className={`${currentMenu === 'product' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Stock Management')}>
                                            <div className="flex items-center">
                                                <Link href="#" className="flex items-center">
                                                    {/* <IconMenuMailbox className="shrink-0 group-hover:!text-primary" /> */}
                                                    <Image
                                                        src={StockManagementImage.src}
                                                        alt="Stock"
                                                        className="h-5 w-5 shrink-0 object-cover group-hover:!text-primary rtl:mr-3"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Stock Management')}</span>
                                                </Link>
                                            </div>

                                            <div className={currentMenu !== 'Stock Management' ? '-rotate-90 rtl:rotate-90' : ''} >
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={currentMenu === 'Stock Management' ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li className="relative flex items-center">
                                                    <Link href="/lowStock" className="flex items-center space-x-2">
                                                        <div>
                                                            <span className="flex items-center">{t('Out Of Stocks')}</span>
                                                        </div>
                                                        <div className=" w-6 ">
                                                            <span className="flex w-full items-center justify-center rounded-full bg-primary py-1 text-xs font-bold text-white">{lowStockCount}</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li className="relative flex items-center">
                                                    <Link href="/lastUpdates" className="flex items-center space-x-2">
                                                        <div>
                                                            <span className="flex items-center">{t('Last updated details')}</span>
                                                        </div>
                                                        <div className="w-7">
                                                            <span className="flex w-full items-center justify-center rounded-full bg-primary py-1 text-xs font-bold text-white">{lastUpdateCount}</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </AnimateHeight>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/payments" className="group">
                                            <div className="flex items-center">
                                                {/* <IconPaymentList className="shrink-0 group-hover:!text-primary" /> */}
                                                <Image src={PaymentImage.src} alt="Payments" className="h-5 w-5 shrink-0 object-cover group-hover:!text-primary rtl:mr-3" width={20} height={20} />
                                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Payments')}</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link href="/shipping_zone" className="group">
                                            <div className="flex items-center">
                                                {/* <IconPaymentList className="shrink-0 group-hover:!text-primary" /> */}
                                                <Image src={PaymentImage.src} alt="Payments" className="h-5 w-5 shrink-0 object-cover group-hover:!text-primary rtl:mr-3" width={20} height={20} />
                                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Shipping Zone')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/media" className="group">
                                            <div className="flex items-center">
                                                {/* <IconMenuChat className="shrink-0 group-hover:!text-primary" /> */}
                                                <Image src={MediaImage.src} alt="Media" className="h-5 w-5 shrink-0 object-cover group-hover:!text-primary rtl:mr-3" width={20} height={20} />
                                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Media')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/coupon" className="group">
                                            <div className="flex items-center">
                                                {/* <IconMenuChat className="shrink-0 group-hover:!text-primary" /> */}
                                                <Image src={CouponsImage.src} alt="Coupons" className="h-5 w-5 shrink-0 object-cover group-hover:!text-primary rtl:mr-3" width={20} height={20} />
                                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Coupons')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/discount" className="group">
                                            <div className="flex items-center">
                                                {/* <IconMenuChat className="shrink-0 group-hover:!text-primary" /> */}
                                                <Image src={DiscountImage.src} alt="Discounts" className="h-5 w-5 shrink-0 object-cover group-hover:!text-primary rtl:mr-3" width={20} height={20} />
                                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Discounts')}</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link href="/abandoneCart" className="group">
                                            <div className="flex items-center">
                                                {/* <IconMenuChat className="shrink-0 group-hover:!text-primary" /> */}
                                                <Image
                                                    src={AbandedCartImage.src}
                                                    alt="Abandoned Carts"
                                                    className="h-5 w-5 shrink-0 object-cover group-hover:!text-primary rtl:mr-3"
                                                    width={20}
                                                    height={20}
                                                />
                                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Abandoned Carts')}</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link href="/dropShippingImport" className="group ">
                                            <div className="flex items-center ">
                                                {/* <IconMenuChat className="shrink-0 group-hover:!text-primary" /> */}
                                                <Image
                                                    src={DropShippingImage.src}
                                                    alt="Drop Shipping Import"
                                                    className="h-5 w-5 shrink-0 object-cover group-hover:!text-primary rtl:mr-3"
                                                    width={20}
                                                    height={20}
                                                />
                                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Drop Shipping Import')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    {isAdmin && (
                                        <li className="nav-item">
                                            <Link href="/apps/staffManager" className="group">
                                                <div className="flex items-center">
                                                    {/* <IconMenuChat className="shrink-0 group-hover:!text-primary" /> */}
                                                    <Image
                                                        src={DiscountImage.src}
                                                        alt="Discounts"
                                                        className="h-5 w-5 shrink-0 object-cover group-hover:!text-primary rtl:mr-3"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Staff Manager')}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    )}
                                    {/* <li className="nav-item">
                                        <Link href="/shipping/shipping" className="group">
                                            <div className="flex items-center">
                                                <IconMenuUsers className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Shipping')}</span>
                                            </div>
                                        </Link>
                                    </li> 
                                  <li className="nav-item">
                                        <Link href="/coupons/coupon" className="group">
                                            <div className="flex items-center">
                                                <IconMenuUsers className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Coupon')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/apps/mailbox" className="group">
                                            <div className="flex items-center">
                                                <IconMenuMailbox className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('mailbox')}</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link href="/apps/todolist" className="group">
                                            <div className="flex items-center">
                                                <IconMenuTodo className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('todo_list')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/apps/notes" className="group">
                                            <div className="flex items-center">
                                                <IconMenuNotes className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('notes')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/apps/scrumboard" className="group">
                                            <div className="flex items-center">
                                                <IconMenuScrumboard className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('scrumboard')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/apps/contacts" className="group">
                                            <div className="flex items-center">
                                                <IconMenuContacts className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('contacts')}</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="menu nav-item">
                                        <button type="button" className={`${currentMenu === 'invoice' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('invoice')}>
                                            <div className="flex items-center">
                                                <IconMenuInvoice className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('invoice')}</span>
                                            </div>

                                            <div className={currentMenu !== 'invoice' ? '-rotate-90 rtl:rotate-90' : ''}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={currentMenu === 'invoice' ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li>
                                                    <Link href="/apps/invoice/list">{t('list')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/apps/invoice/preview">{t('preview')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/apps/invoice/add">{t('add')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/apps/invoice/edit">{t('edit')}</Link>
                                                </li>
                                            </ul>
                                        </AnimateHeight>
                                    </li> */}

                                    {/* <li className="nav-item">
                                        <Link href="/apps/calendar" className="group">
                                            <div className="flex items-center">
                                                <IconMenuCalendar className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('calendar')}</span>
                                            </div>
                                        </Link>
                                    </li>  */}
                                </ul>
                            </li>

                            {/* <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('user_interface')}</span>
                            </h2>

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'component' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('component')}>
                                    <div className="flex items-center">
                                        <IconMenuComponents className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('components')}</span>
                                    </div>

                                    <div className={currentMenu !== 'component' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'component' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/components/tabs">{t('tabs')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/accordions">{t('accordions')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/modals">{t('modals')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/cards">{t('cards')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/carousel">{t('carousel')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/countdown">{t('countdown')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/counter">{t('counter')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/sweetalert">{t('sweet_alerts')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/timeline">{t('timeline')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/notifications">{t('notifications')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/media-object">{t('media_object')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/list-group">{t('list_group')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/pricing-table">{t('pricing_tables')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/lightbox">{t('lightbox')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'element' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('element')}>
                                    <div className="flex items-center">
                                        <IconMenuElements className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('elements')}</span>
                                    </div>

                                    <div className={currentMenu !== 'element' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'element' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/elements/alerts">{t('alerts')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/avatar">{t('avatar')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/badges">{t('badges')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/breadcrumbs">{t('breadcrumbs')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/buttons">{t('buttons')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/buttons-group">{t('button_groups')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/color-library">{t('color_library')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/dropdown">{t('dropdown')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/infobox">{t('infobox')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/jumbotron">{t('jumbotron')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/loader">{t('loader')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/pagination">{t('pagination')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/popovers">{t('popovers')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/progress-bar">{t('progress_bar')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/search">{t('search')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/tooltips">{t('tooltips')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/treeview">{t('treeview')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/typography">{t('typography')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className="menu nav-item">
                                <Link href="/charts" className="group">
                                    <div className="flex items-center">
                                        <IconMenuCharts className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('charts')}</span>
                                    </div>
                                </Link>
                            </li>

                            <li className="menu nav-item">
                                <Link href="/widgets" className="group">
                                    <div className="flex items-center">
                                        <IconMenuWidgets className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('widgets')}</span>
                                    </div>
                                </Link>
                            </li>

                            <li className="menu nav-item">
                                <Link href="/font-icons" className="group">
                                    <div className="flex items-center">
                                        <IconMenuFontIcons className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('font_icons')}</span>
                                    </div>
                                </Link>
                            </li>

                            <li className="menu nav-item">
                                <Link href="/dragndrop" className="group">
                                    <div className="flex items-center">
                                        <IconMenuDragAndDrop className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('drag_and_drop')}</span>
                                    </div>
                                </Link>
                            </li>

                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('tables_and_forms')}</span>
                            </h2>

                            <li className="menu nav-item">
                                <Link href="/tables" className="group">
                                    <div className="flex items-center">
                                        <IconMenuTables className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('tables')}</span>
                                    </div>
                                </Link>
                            </li> */}
                            {/* 
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'datalabel' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('datalabel')}>
                                    <div className="flex items-center">
                                        <IconMenuDatatables className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('datatables')}</span>
                                    </div>

                                    <div className={currentMenu !== 'datalabel' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'datalabel' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/datatables/basic">{t('basic')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/advanced">{t('advanced')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/skin">{t('skin')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/order-sorting">{t('order_sorting')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/multi-column">{t('multi_column')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/multiple-tables">{t('multiple_tables')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/alt-pagination">{t('alt_pagination')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/checkbox">{t('checkbox')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/range-search">{t('range_search')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/export">{t('export')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/column-chooser">{t('column_chooser')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li> */}

                            {/* <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'forms' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('forms')}>
                                    <div className="flex items-center">
                                        <IconMenuForms className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('forms')}</span>
                                    </div>

                                    <div className={currentMenu !== 'forms' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'forms' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/forms/basic">{t('basic')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/input-group">{t('input_group')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/layouts">{t('layouts')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/validation">{t('validation')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/input-mask">{t('input_mask')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/select2">{t('select2')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/touchspin">{t('touchspin')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/checkbox-radio">{t('checkbox_and_radio')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/switches">{t('switches')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/wizards">{t('wizards')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/file-upload">{t('file_upload')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/quill-editor">{t('quill_editor')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/markdown-editor">{t('markdown_editor')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/date-picker">{t('date_and_range_picker')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/clipboard">{t('clipboard')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('user_and_pages')}</span>
                            </h2>

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'users' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('users')}>
                                    <div className="flex items-center">
                                        <IconMenuUsers className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('users')}</span>
                                    </div>

                                    <div className={currentMenu !== 'users' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'users' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/users/profile">{t('profile')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/users/user-account-settings">{t('account_settings')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li> */}

                            {/* <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'page' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('page')}>
                                    <div className="flex items-center">
                                        <IconMenuPages className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('pages')}</span>
                                    </div>

                                    <div className={currentMenu !== 'page' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'page' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/pages/knowledge-base">{t('knowledge_base')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/contact-us-boxed" target="_blank">
                                                {t('contact_us_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/contact-us-cover" target="_blank">
                                                {t('contact_us_cover')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/faq">{t('faq')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/coming-soon-boxed" target="_blank">
                                                {t('coming_soon_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/coming-soon-cover" target="_blank">
                                                {t('coming_soon_cover')}
                                            </Link>
                                        </li>
                                        <li className="menu nav-item">
                                            <button
                                                type="button"
                                                className={`${
                                                    errorSubMenu ? 'open' : ''
                                                } w-full before:h-[5px] before:w-[5px] before:rounded before:bg-gray-300 hover:bg-gray-100 ltr:before:mr-2 rtl:before:ml-2 dark:text-[#888ea8] dark:hover:bg-gray-900`}
                                                onClick={() => setErrorSubMenu(!errorSubMenu)}
                                            >
                                                {t('error')}
                                                <div className={`${errorSubMenu ? '-rotate-90 rtl:rotate-90' : ''} ltr:ml-auto rtl:mr-auto`}>
                                                    <IconCaretsDown fill={true} className="h-4 w-4" />
                                                </div>
                                            </button>
                                            <AnimateHeight duration={300} height={errorSubMenu ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    <li>
                                                        <a href="/pages/error404" target="_blank">
                                                            {t('404')}
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="/pages/error500" target="_blank">
                                                            {t('500')}
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="/pages/error503" target="_blank">
                                                            {t('503')}
                                                        </a>
                                                    </li>
                                                </ul>
                                            </AnimateHeight>
                                        </li>

                                        <li>
                                            <Link href="/pages/maintenence" target="_blank">
                                                {t('maintenence')}
                                            </Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li> */}

                            {/* <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'auth' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('auth')}>
                                    <div className="flex items-center">
                                        <IconMenuAuthentication className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('authentication')}</span>
                                    </div>

                                    <div className={currentMenu !== 'auth' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'auth' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/auth/boxed-signin" target="_blank">
                                                {t('login_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/boxed-signup" target="_blank">
                                                {t('register_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/boxed-lockscreen" target="_blank">
                                                {t('unlock_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/boxed-password-reset" target="_blank">
                                                {t('recover_id_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/cover-login" target="_blank">
                                                {t('login_cover')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/cover-register" target="_blank">
                                                {t('register_cover')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/cover-lockscreen" target="_blank">
                                                {t('unlock_cover')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/cover-password-reset" target="_blank">
                                                {t('recover_id_cover')}
                                            </Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li> */}

                            {/* <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('supports')}</span>
                            </h2>

                            <li className="menu nav-item">
                                <Link href="https://vristo.sbthemes.com" target="_blank" className="nav-link group">
                                    <div className="flex items-center">
                                        <IconMenuDocumentation className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('documentation')}</span>
                                    </div>
                                </Link>
                            </li>  */}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
