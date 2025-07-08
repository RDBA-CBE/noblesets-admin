import { gql } from '@apollo/client';

export const CREATE_PRICE_BREAKUP = gql`
    mutation PriceBreakupCreate($product: ID!, $breakupDetails: String!) {
        priceBreakupCreate(input: { product: $product, breakupDetails: $breakupDetails }) {
            errors {
                code
                message
                values
                __typename
            }
            __typename
            priceBreakup {
                breakupDetails
                id
            }
        }
    }
`;

export const UPDATE_PRICE_BREAKUP = gql`
    mutation PriceBreakupUpdate($id: ID!, $product: ID!, $breakupDetails: String!) {
        priceBreakupUpdate(id: $id, input: { product: $product, breakupDetails: $breakupDetails }) {
            errors {
                message
                code
                field
            }
        }
    }
`;

// export const PRICE_BREAKUP_DETAIL = gql``;

// export const PRICE_BREAKUP_LIST = gql``;

// export const DELETE_PRICE_BREAKUP = gql``;
