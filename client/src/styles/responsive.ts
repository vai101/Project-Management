import { css } from 'styled-components';
import { theme } from './theme';

export const media = {
  sm: (styles: any) => css`
    @media (min-width: ${theme.breakpoints.sm}) {
      ${styles}
    }
  `,
  md: (styles: any) => css`
    @media (min-width: ${theme.breakpoints.md}) {
      ${styles}
    }
  `,
  lg: (styles: any) => css`
    @media (min-width: ${theme.breakpoints.lg}) {
      ${styles}
    }
  `,
  xl: (styles: any) => css`
    @media (min-width: ${theme.breakpoints.xl}) {
      ${styles}
    }
  `,
  '2xl': (styles: any) => css`
    @media (min-width: ${theme.breakpoints['2xl']}) {
      ${styles}
    }
  `,
  mobile: (styles: any) => css`
    @media (max-width: ${theme.breakpoints.md}) {
      ${styles}
    }
  `,
  tablet: (styles: any) => css`
    @media (min-width: ${theme.breakpoints.md}) and (max-width: ${theme.breakpoints.lg}) {
      ${styles}
    }
  `,
  desktop: (styles: any) => css`
    @media (min-width: ${theme.breakpoints.lg}) {
      ${styles}
    }
  `,
};

export const responsiveSpacing = {
  xs: css`
    padding: ${theme.spacing[2]};
    ${media.sm(css`
      padding: ${theme.spacing[3]};
    `)}
    ${media.md(css`
      padding: ${theme.spacing[4]};
    `)}
  `,
  sm: css`
    padding: ${theme.spacing[3]};
    ${media.sm(css`
      padding: ${theme.spacing[4]};
    `)}
    ${media.md(css`
      padding: ${theme.spacing[5]};
    `)}
  `,
  md: css`
    padding: ${theme.spacing[4]};
    ${media.sm(css`
      padding: ${theme.spacing[5]};
    `)}
    ${media.md(css`
      padding: ${theme.spacing[6]};
    `)}
  `,
  lg: css`
    padding: ${theme.spacing[5]};
    ${media.sm(css`
      padding: ${theme.spacing[6]};
    `)}
    ${media.md(css`
      padding: ${theme.spacing[8]};
    `)}
  `,
};

export const responsiveTypography = {
  heading: css`
    font-size: ${theme.typography.fontSize.xl};
    ${media.sm(css`
      font-size: ${theme.typography.fontSize['2xl']};
    `)}
    ${media.md(css`
      font-size: ${theme.typography.fontSize['3xl']};
    `)}
  `,
  subheading: css`
    font-size: ${theme.typography.fontSize.lg};
    ${media.sm(css`
      font-size: ${theme.typography.fontSize.xl};
    `)}
    ${media.md(css`
      font-size: ${theme.typography.fontSize['2xl']};
    `)}
  `,
  body: css`
    font-size: ${theme.typography.fontSize.sm};
    ${media.sm(css`
      font-size: ${theme.typography.fontSize.base};
    `)}
  `,
};

export const responsiveLayout = {
  container: css`
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 ${theme.spacing[4]};
    
    ${media.sm(css`
      padding: 0 ${theme.spacing[6]};
    `)}
    ${media.md(css`
      padding: 0 ${theme.spacing[8]};
    `)}
    ${media.lg(css`
      max-width: 1200px;
    `)}
    ${media.xl(css`
      max-width: 1400px;
    `)}
  `,
  grid: css`
    display: grid;
    gap: ${theme.spacing[4]};
    
    ${media.sm(css`
      gap: ${theme.spacing[6]};
    `)}
    ${media.md(css`
      gap: ${theme.spacing[8]};
    `)}
  `,
  flex: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[4]};
    
    ${media.sm(css`
      flex-direction: row;
      gap: ${theme.spacing[6]};
    `)}
  `,
};

export const responsiveVisibility = {
  mobileOnly: css`
    display: block;
    ${media.sm(css`
      display: none;
    `)}
  `,
  desktopOnly: css`
    display: none;
    ${media.sm(css`
      display: block;
    `)}
  `,
  tabletOnly: css`
    display: none;
    ${media.md(css`
      display: block;
    `)}
    ${media.lg(css`
      display: none;
    `)}
  `,
};

export const responsiveSidebar = {
  mobile: css`
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 280px;
    z-index: ${theme.zIndex.modal};
    transform: translateX(-100%);
    transition: transform ${theme.transitions.normal};
    
    &.open {
      transform: translateX(0);
    }
  `,
  desktop: css`
    position: relative;
    transform: none;
    width: 320px;
    flex-shrink: 0;
  `,
};

export const responsiveKanban = {
  columns: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[4]};
    
    ${media.md(css`
      flex-direction: row;
      gap: ${theme.spacing[6]};
    `)}
  `,
  column: css`
    min-width: 100%;
    
    ${media.md(css`
      min-width: 300px;
      flex: 1;
    `)}
  `,
  cards: css`
    display: grid;
    gap: ${theme.spacing[3]};
    
    ${media.sm(css`
      gap: ${theme.spacing[4]};
    `)}
  `,
};