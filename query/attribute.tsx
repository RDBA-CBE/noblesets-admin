import { gql } from '@apollo/client';

export const CREATE_ATTRIBUTE = gql`
    mutation AttributeCreate($input: AttributeCreateInput!) {
        attributeCreate(input: $input) {
            attribute {
                id
                __typename
            }
            errors {
                ...AttributeError
                __typename
            }
            __typename
        }
    }

    fragment AttributeError on AttributeError {
        code
        field
        message
        __typename
    }
`;

export const UPDATE_PRODUCT_TYPE = gql`
    mutation UpdateProductType($id: ID!, $productAttributes: [ID!]) {
        productTypeUpdate(id: $id, input: { productAttributes: $productAttributes }) {
            productType {
                name
                productAttributes {
                    name
                }
            }
            errors {
                field
                message
            }
        }
    }
`;
