export const commonBody = {
    PERMISSION_HANDLE_CHECKOUTS: true,
    PERMISSION_HANDLE_PAYMENTS: true,
    PERMISSION_HANDLE_TAXES: true,
    PERMISSION_IMPERSONATE_USER: true,
    PERMISSION_MANAGE_APPS: true,
    PERMISSION_MANAGE_CHANNELS: true,
    PERMISSION_MANAGE_CHECKOUTS: true,
    PERMISSION_MANAGE_DISCOUNTS: true,
    PERMISSION_MANAGE_GIFT_CARD: true,
    PERMISSION_MANAGE_MENUS: true,
    PERMISSION_MANAGE_OBSERVABILITY: true,
    PERMISSION_MANAGE_ORDERS: true,
    PERMISSION_MANAGE_ORDERS_IMPORT: true,
    PERMISSION_MANAGE_PAGES: true,
    PERMISSION_MANAGE_PAGE_TYPES_AND_ATTRIBUTES: true,
    PERMISSION_MANAGE_PLUGINS: true,
    PERMISSION_MANAGE_PRODUCTS: true,
    PERMISSION_MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES: true,
    PERMISSION_MANAGE_SETTINGS: true,
    PERMISSION_MANAGE_SHIPPING: true,
    PERMISSION_MANAGE_STAFF: true,
    PERMISSION_MANAGE_TAXES: true,
    PERMISSION_MANAGE_TRANSLATIONS: true,
    PERMISSION_MANAGE_USERS: true,
};

export const STATUS_MAP = {
    placed: 0,
    confirmed: 1,
    shipped: 2,
    delivered: 3,
    returned: 5,
    cancelled: 4,
};

export const STEPS = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];

export const CANCEL_STEPS = ['placed', 'confirmed', 'shipped',  'cancelled', 'returned'];


export const BLUEDART_STATUS_TO_ORDER_STATUS = {
    NF: 'placed', // No Info Found
    PU: 'confirmed', // Online booked / Picked up
    IT: 'shipped', // In Transit
    OD: 'shipped', // Out for Delivery
    UD: 'shipped', // Generic transit updates
    DL: 'delivered', // Delivered

    RT: 'returned', // Returned
    CN: 'cancelled', // Cancelled
};

export const ORDER_TRACKING_STATUS = {
    Shipment: {
        RefNo: '@@@@',
        WaybillNo: 90397903492,
        Origin: 'TIRUPUR',
        OriginAreaCode: 'TRP',
        Destination: 'CHENNAI',
        DestinationAreaCode: 'TRP',
        ProductType: 'Documents',
        Weight: 0,
        Status: 'SHIPMENT ARRIVED',
        StatusType: 'UD',
        ExpectedDeliveryDate: '27 January 2026',
        StatusDate: '24 January 2026',
        StatusTime: '22:08',
        ReceivedBy: 'KUMAR',
        Instructions: 'Awb# not linked your a/c',
        Scans: [
            {
                Scan: 'Online shipment booked',
                ScanCode: '030',
                ScanType: 'PU',
                ScanGroupType: 'S',
                ScanDate: '22-Jan-2026',
                ScanTime: '13:40',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'SHIPMENT PICKED UP',
                ScanCode: '015',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '23-Jan-2026',
                ScanTime: '17:27',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'SHIPMENT ARRIVED',
                ScanCode: '001',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '23-Jan-2026',
                ScanTime: '18:31',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'SHIPMENT FURTHER CONNECTED',
                ScanCode: '003',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '23-Jan-2026',
                ScanTime: '23:10',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'PAPER WORK INSCAN',
                ScanCode: '014',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '24-Jan-2026',
                ScanTime: '01:43',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'SHIPMENT ARRIVED',
                ScanCode: '001',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '24-Jan-2026',
                ScanTime: '02:16',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'SHIPMENT FURTHER CONNECTED',
                ScanCode: '003',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '24-Jan-2026',
                ScanTime: '06:02',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'PAPER WORK INSCAN',
                ScanCode: '014',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '24-Jan-2026',
                ScanTime: '15:32',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'SHIPMENT ARRIVED',
                ScanCode: '001',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '24-Jan-2026',
                ScanTime: '15:59',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'SHIPMENT FURTHER CONNECTED',
                ScanCode: '003',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '25-Jan-2026',
                ScanTime: '04:40',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'PAPER WORK INSCAN',
                ScanCode: '014',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '25-Jan-2026',
                ScanTime: '11:16',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'SHIPMENT ARRIVED',
                ScanCode: '001',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '25-Jan-2026',
                ScanTime: '11:45',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'SHIPMENT FURTHER CONNECTED',
                ScanCode: '003',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '26-Jan-2026',
                ScanTime: '01:25',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'PAPER WORK INSCAN',
                ScanCode: '014',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '26-Jan-2026',
                ScanTime: '10:18',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'SHIPMENT ARRIVED',
                ScanCode: '001',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '26-Jan-2026',
                ScanTime: '10:21',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'DELIVERY SCHEDULED FOR NEXT WORKING DAY',
                ScanCode: '029',
                ScanType: 'UD',
                ScanGroupType: 'T',
                ScanDate: '26-Jan-2026',
                ScanTime: '17:47',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'SHIPMENT OUT FOR DELIVERY',
                ScanCode: '002',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '27-Jan-2026',
                ScanTime: '17:07',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'SHIPMENT OUT FOR DELIVERY',
                ScanCode: '002',
                ScanType: 'UD',
                ScanGroupType: 'S',
                ScanDate: '27-Jan-2026',
                ScanTime: '19:41',
                ScannedLocation: 'TIRUPUR',
            },
            {
                Scan: 'SHIPMENT DELIVERED',
                ScanCode: '000',
                ScanType: 'DL',
                ScanGroupType: 'T',
                ScanDate: '27-Jan-2026',
                ScanTime: '22:08',
                ScannedLocation: 'TIRUPUR',
            },
            

        ],
    },
};

export const BLUE_DART = {
    // LIVE DATA
    // "customerCode": "TRP048366",
    // "customerName": "SHIVAM TRADERS",
    // "loginId": "TRP67122",
    // "liveApiKey": "evgkukoko6p3iosfktj76klhvkgmqol",
    // "liveTrackKey": "hisihnfjlq70qiqkhhkkqtjvqulmhqkt"

    API_KEY: '3K5LxWWJnBpC92pQI29exNqRfIuKvSJl',
    API_SECRET: 'SDnWsfLstFqLTXGG',
    TRACKING_KEY: 'itjueshurqqufeglhnfsnmthtpm0ph3e',
    CUSTOMER_CODE: '048366',
    ORGINE_AREA: 'TRP',
    CLIENT_ID: '3K5LxWWJnBpC92pQI29exNqRfIuKvSJl',
    CLIENT_SECRET: 'SDnWsfLstFqLTXGG',

    BaseUrl: 'https://apigateway-sandbox.bluedart.com/in/transportation',
    Api_type: 'S',
    LicenceKey: 'evgkukoko6p3iosfktj76klhrvkgmqol',
    LoginID: 'TRP46786',
    TokenUrl: 'https://nobledemo.irepute.co.in/api/bluedart-token',
    JWTToken:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdWJqZWN0LXN1YmplY3QiLCJhdWQiOlsiYXVkaWVuY2UxIiwiYXVkaWVuY2UyIl0sImlzcyI6InVybjovL2FwaWdlZS1lZGdlLUpXVC1wb2xpY3ktdGVzdCIsImV4cCI6MTc2OTkxODgyOSwiaWF0IjoxNzY5ODMyNDI5LCJqdGkiOiI0YWQ4NWExMi05NzBiLTQxMGMtODFmMi05ODljMWY2NDA4ZTAifQ.s96XU7l6KcNbxC75UgGdhgJ7ewpShOkNv63nNJ-yn3U',
};

export const BLUE_DART_LIVE = {
    // LIVE DATA
    // "customerCode": "TRP048366",
    // "customerName": "SHIVAM TRADERS",
    // "loginId": "TRP67122",
    // "liveApiKey": "evgkukoko6p3iosfktj76klhvkgmqol",
    // "liveTrackKey": "hisihnfjlq70qiqkhhkkqtjvqulmhqkt"

    API_KEY: '3K5LxWWJnBpC92pQI29exNqRfIuKvSJl',
    API_SECRET: 'SDnWsfLstFqLTXGG',
    TRACKING_KEY: 'itjueshurqqufeglhnfsnmthtpm0ph3e',
    CUSTOMER_CODE: '048366',
    ORGINE_AREA: 'TRP',
    CLIENT_ID: '3K5LxWWJnBpC92pQI29exNqRfIuKvSJl',
    CLIENT_SECRET: 'SDnWsfLstFqLTXGG',
    BaseUrl: 'https://apigateway.bluedart.com/in/transportation',
    Api_type: 'S',
    LicenceKey: 'evgkukoko6p3iosfktj76klhrvkgmqol',
    TrackingLicKey: 'hisihnfjlq70qiqkhhkkqtjvqulmhqkt',
    LoginID: 'TRP67122',
    TokenUrl: 'https://nobledemo.irepute.co.in/api/bluedart-token',
    JWTToken:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdWJqZWN0LXN1YmplY3QiLCJhdWQiOlsiYXVkaWVuY2UxIiwiYXVkaWVuY2UyIl0sImlzcyI6InVybjovL2FwaWdlZS1lZGdlLUpXVC1wb2xpY3ktdGVzdCIsImV4cCI6MTc2OTg0Mzc0NSwiaWF0IjoxNzY5NzU3MzQ1LCJqdGkiOiI0ZTNiYWIyMi0zMzE2LTRlMjgtOWM0OS1lNDljODEzNDRlNTQifQ.XgFMU_5ZTUhsKjqjRQK39QPyvUnVtclwt4m7aCEYfcQ', // 🔴 IMPORTANT
};
