export const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1024,
};

export const QUERIES = {
    MOBILE: `(max-width: ${BREAKPOINTS.MOBILE}px)`,
    DESKTOP: `(min-width: ${BREAKPOINTS.MOBILE + 1}px)`,
};
