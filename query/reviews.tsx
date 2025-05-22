import { gql } from '@apollo/client';

export const CREATE_BRAND = gql`
    mutation CreateBrand($input: BrandInput!) {
        brandCreate(input: $input) {
            brand {
                id
                name
                slug
                logo
            }
            errors {
                field
                message
            }
        }
    }
`;

export const REVIEWS_LIST = gql`
 query ProductReviews($after: String, $before: String, $first: Int, $last: Int, $filter: ProductReviewFilterInput) {
  productReviews(
    after: $after
    before: $before
    first: $first
    last: $last
    filter: $filter
  ) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
      __typename
    }
    edges {
      node {
        id
        rating
        product {
          id
          name
          thumbnail {
            url
            __typename
          }
          __typename
          productReviews {
            user {
              email
              id
              lastName
              firstName
            }
            comment
            createdAt
          }
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
`;

export const UPDATE_BRAND = gql`
    mutation UpdateBrand($id: ID!, $input: BrandInput!) {
        brandUpdate(id: $id, input: $input) {
            brand {
                id
                name
                slug
                logo
            }
            errors {
                field
                message
            }
        }
    }
`;

export const DELETE_BRAND = gql`
    mutation DeleteBrand($id: ID!) {
        brandDelete(id: $id) {
            brand {
                id
                name
                slug
            }
            errors {
                field
                message
            }
        }
    }
`;

export const WAREHOUSE_LIST = gql`
    query MyQuery {
        warehouses(first: 10) {
            totalCount
            edges {
                cursor
                node {
                    id
                    name
                    slug
                    email
                }
            }
        }
    }
`;
