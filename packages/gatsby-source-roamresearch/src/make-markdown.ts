import { RoamPage, RoamBlock } from "fetch-roamresearch";

export type References = { blocks: string[]; pages: string[] };

// Find matches for content between double brackets
// e.g. [[Example]] -> Example
const bracketRegexExclusive = /(?<=\[\[).*?(?=\]\])/g;

// Find matches for content between double parenthesis
// e.g. ((Example)) -> Example
const parenthesisRegexExclusive = /(?<=\(\().*?(?=\)\))/g;

// Find matches for content after hashtag
// e.g. #Example -> Example
const hashtagRegexExclusive = /(?<=(^|\s)#)\w*\b/g;

const getReferences = (string: string) => {
  const references: References = {
    blocks: [],
    pages: [],
  };

  const bracketMatches = string.match(bracketRegexExclusive);
  if (bracketMatches !== null) {
    references.pages.push(...bracketMatches);
  }

  const parenthesisMatches = string.match(parenthesisRegexExclusive);
  if (parenthesisMatches !== null) {
    references.blocks.push(...parenthesisMatches);
  }

  const hashtagMatches = string.match(hashtagRegexExclusive);
  if (hashtagMatches !== null) {
    references.pages.push(...hashtagMatches);
  }

  return references;
};

function replaceSpecialCharacter(string: string) {
  return string.replace(/</g, "&#x3C;").replace(/>/g, "&#x3E;");
}

export const makeMarkdownForBlock = (block: RoamBlock, indent: string = "") => {
  const outboundReferences = getReferences(block.string);
  const allOutboundReferences = {
    pages: [...outboundReferences.pages],
    blocks: [...outboundReferences.blocks],
  };
  const string = replaceSpecialCharacter(block.string);
  let res = string;

  block.children?.forEach((child) => {
    const resForBlock = makeMarkdownForBlock(child, `${indent}  `);
    allOutboundReferences.blocks.push(
      ...resForBlock.allOutboundReferences.blocks
    );
    allOutboundReferences.pages.push(
      ...resForBlock.allOutboundReferences.pages
    );
    res += `\n${indent}  - ${resForBlock.allString}`;
  });

  return { string, allString: res, outboundReferences, allOutboundReferences };
};

export const makeMarkdown = (page: RoamPage | RoamBlock) => {
  const value = "title" in page ? page.title : page.string;
  const outboundReferences = getReferences(value);
  const allOutboundReferences = {
    pages: [...outboundReferences.pages],
    blocks: [...outboundReferences.blocks],
  };
  const string = replaceSpecialCharacter(value);
  let res = `# ${string}`;

  page.children?.forEach((block) => {
    const resForBlock = makeMarkdownForBlock(block);
    allOutboundReferences.blocks.push(
      ...resForBlock.allOutboundReferences.blocks
    );
    allOutboundReferences.pages.push(
      ...resForBlock.allOutboundReferences.pages
    );
    res += `\n- ${resForBlock.allString}`;
  });

  return { string, allString: res, outboundReferences, allOutboundReferences };
};
