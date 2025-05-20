import { gql } from '@apollo/client';

export const ZONE_DETAILS = gql`
    query MyQuery($id: ID!, $countries: [CountryCode!]) {
        shippingZone(id: $id) {
            name
            __typename
            channels {
                availableShippingMethodsPerCountry(countries: $countries) {
                    shippingMethods {
                        name
                        price {
                            amount
                            currency
                        }
                        id
                    }
                    countryCode
                }
            }
        }
    }
`;

export const ZONE_LIST = gql`
    query GetShippingZones($first: Int, $after: String, $before: String, $last: Int) {
        shippingZones(first: $first, after: $after, before: $before, last: $last) {
            edges {
                node {
                    id
                    name
                    shippingMethods {
                        id
                        name
                        type
                        channelListings {
                            channel {
                                name
                            }
                            price {
                                amount
                                currency
                            }
                        }
                    }
                }
            }
            totalCount
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
            }
        }
    }
`;

export const CREATE_ZONE = gql`
    mutation CreateShippingZone($input: ShippingZoneCreateInput!) {
        shippingZoneCreate(input: $input) {
            shippingZone {
                id
                name
                countries {
                    code
                    country
                }
            }
            errors {
                field
                message
            }
        }
    }
`;

export const CREATE_SHIPPING_METHOD = gql`
    mutation CreateShippingMethod($input: ShippingPriceInput!) {
        shippingPriceCreate(input: $input) {
            shippingMethod {
                id
                name
                type
            }
            errors {
                field
                message
            }
        }
    }
`;

export const DELETE_ZONE = gql`
    mutation DeleteShippingZone($id: ID!) {
        shippingZoneDelete(id: $id) {
            errors {
                message
                field
                code
            }
        }
    }
`;

export const UPDATE_CHANNEL_LIST_UPDATE = gql`
    mutation UpdateShippingMethodChannelListing($id: ID!, $input: ShippingMethodChannelListingInput!) {
        shippingMethodChannelListingUpdate(id: $id, input: $input) {
            shippingMethod {
                id
                name
            }
            errors {
                field
                message
            }
        }
    }
`;
