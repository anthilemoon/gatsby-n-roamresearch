import React from "react";
import { graphql } from "gatsby";
import * as PropTypes from "prop-types";
import Page from "../templates/page";

const propTypes = {
  data: PropTypes.object.isRequired,
};

const IndexPage = ({ data }) => {
  return <Page data={data} />;
};

IndexPage.propTypes = propTypes;

export default IndexPage;

export const pageQuery = graphql`
  query {
    roamPage(title: { eq: "About these notes" }) {
      fields {
        allMarkdown {
          childMdx {
            body
          }
        }
        allOutboundReferences {
          ... on RoamBlock {
            id
            uid
            string
            fields {
              parentPage {
                title
              }
              slug
              markdown {
                childMdx {
                  body
                }
              }
            }
          }
          ... on RoamPage {
            id
            title
            fields {
              slug
              markdown {
                childMdx {
                  body
                }
              }
            }
          }
        }
        inboundReferences {
          ... on RoamBlock {
            id
            string
            fields {
              parentPage {
                title
              }
              slug
              markdown {
                childMdx {
                  body
                }
              }
            }
          }
          ... on RoamPage {
            id
            title
            fields {
              slug
              markdown {
                childMdx {
                  body
                }
              }
            }
          }
        }
      }
    }
  }
`;
