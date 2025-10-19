import styled, { css } from 'styled-components';
import { theme } from './theme';

export const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  $fullWidth?: boolean;
  $isLoading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.fast};
  cursor: pointer;
  position: relative;
  overflow: hidden;

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          font-size: ${theme.typography.fontSize.sm};
          min-height: 32px;
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing[3]} ${theme.spacing[6]};
          font-size: ${theme.typography.fontSize.lg};
          min-height: 48px;
        `;
      default:
        return css`
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          font-size: ${theme.typography.fontSize.base};
          min-height: 40px;
        `;
    }
  }}

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
          color: ${theme.colors.text.inverse};
          box-shadow: ${theme.shadows.sm};

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${theme.colors.primary[600]}, ${theme.colors.primary[700]});
            box-shadow: ${theme.shadows.md};
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      case 'secondary':
        return css`
          background: ${theme.colors.neutral[100]};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.neutral[300]};

          &:hover:not(:disabled) {
            background: ${theme.colors.neutral[200]};
            border-color: ${theme.colors.neutral[400]};
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${theme.colors.primary[600]};
          border: 1px solid ${theme.colors.primary[300]};

          &:hover:not(:disabled) {
            background: ${theme.colors.primary[50]};
            border-color: ${theme.colors.primary[400]};
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.text.secondary};

          &:hover:not(:disabled) {
            background: ${theme.colors.neutral[100]};
            color: ${theme.colors.text.primary};
          }
        `;
      case 'danger':
        return css`
          background: linear-gradient(135deg, ${theme.colors.error[500]}, ${theme.colors.error[600]});
          color: ${theme.colors.text.inverse};
          box-shadow: ${theme.shadows.sm};

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${theme.colors.error[600]}, ${theme.colors.error[700]});
            box-shadow: ${theme.shadows.md};
            transform: translateY(-1px);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      color: transparent;

      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    `}
`;

export const Input = styled.input<{
  hasError?: boolean;
  size?: 'sm' | 'md' | 'lg';
}>`
  width: 100%;
  padding: ${theme.spacing[3]};
  border: 1px solid ${({ hasError }) => (hasError ? theme.colors.error[300] : theme.colors.neutral[300])};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background.primary};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.base};
  transition: all ${theme.transitions.fast};

  &::placeholder {
    color: ${theme.colors.text.muted};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }

  &:disabled {
    background: ${theme.colors.neutral[100]};
    color: ${theme.colors.text.muted};
    cursor: not-allowed;
  }

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${theme.spacing[2]};
          font-size: ${theme.typography.fontSize.sm};
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing[4]};
          font-size: ${theme.typography.fontSize.lg};
        `;
    }
  }}
`;

export const Textarea = styled.textarea<{
  hasError?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}>`
  width: 100%;
  padding: ${theme.spacing[3]};
  border: 1px solid ${({ hasError }) => (hasError ? theme.colors.error[300] : theme.colors.neutral[300])};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background.primary};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.base};
  font-family: inherit;
  line-height: ${theme.typography.lineHeight.normal};
  resize: ${({ resize = 'vertical' }) => resize};
  transition: all ${theme.transitions.fast};

  &::placeholder {
    color: ${theme.colors.text.muted};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }

  &:disabled {
    background: ${theme.colors.neutral[100]};
    color: ${theme.colors.text.muted};
    cursor: not-allowed;
  }
`;

export const Card = styled.div<{
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
}>`
  background: ${theme.colors.background.primary};
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.transitions.normal};

  ${({ variant = 'default' }) => {
    switch (variant) {
      case 'elevated':
        return css`
          box-shadow: ${theme.shadows.lg};
          border: 1px solid ${theme.colors.neutral[200]};
        `;
      case 'outlined':
        return css`
          border: 1px solid ${theme.colors.neutral[300]};
        `;
      default:
        return css`
          box-shadow: ${theme.shadows.sm};
          border: 1px solid ${theme.colors.neutral[200]};
        `;
    }
  }}

  ${({ padding = 'md' }) => {
    switch (padding) {
      case 'sm':
        return css`
          padding: ${theme.spacing[4]};
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing[8]};
        `;
      default:
        return css`
          padding: ${theme.spacing[6]};
        `;
    }
  }}

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-1px);
  }
`;

export const Badge = styled.span<{
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}>`
  display: inline-flex;
  align-items: center;
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${theme.borderRadius.full};
  white-space: nowrap;

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${theme.spacing[1]} ${theme.spacing[2]};
          font-size: ${theme.typography.fontSize.xs};
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          font-size: ${theme.typography.fontSize.base};
        `;
      default:
        return css`
          padding: ${theme.spacing[1]} ${theme.spacing[3]};
          font-size: ${theme.typography.fontSize.sm};
        `;
    }
  }}

  ${({ variant = 'default' }) => {
    switch (variant) {
      case 'success':
        return css`
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      case 'warning':
        return css`
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'error':
        return css`
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'info':
        return css`
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[800]};
        `;
      default:
        return css`
          background: ${theme.colors.neutral[100]};
          color: ${theme.colors.neutral[700]};
        `;
    }
  }}
`;

export const Spinner = styled.div<{
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}>`
  width: ${({ size = 'md' }) => {
    switch (size) {
      case 'sm': return '16px';
      case 'lg': return '32px';
      default: return '24px';
    }
  }};
  height: ${({ size = 'md' }) => {
    switch (size) {
      case 'sm': return '16px';
      case 'lg': return '32px';
      default: return '24px';
    }
  }};
  border: 2px solid ${({ color = theme.colors.neutral[300] }) => color};
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

export const Skeleton = styled.div<{
  width?: string;
  height?: string;
  borderRadius?: string;
}>`
  background: linear-gradient(
    90deg,
    ${theme.colors.neutral[200]} 25%,
    ${theme.colors.neutral[100]} 50%,
    ${theme.colors.neutral[200]} 75%
  );
  background-size: 200% 100%;
  animation: pulse 1.5s ease-in-out infinite;
  width: ${({ width = '100%' }) => width};
  height: ${({ height = '20px' }) => height};
  border-radius: ${({ borderRadius = theme.borderRadius.md }) => borderRadius};
`;

export const Divider = styled.hr<{
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
}>`
  border: none;
  background: ${theme.colors.neutral[200]};
  margin: 0;

  ${({ orientation = 'horizontal' }) => {
    switch (orientation) {
      case 'vertical':
        return css`
          width: 1px;
          height: 100%;
        `;
      default:
        return css`
          height: 1px;
          width: 100%;
        `;
    }
  }}

  ${({ variant = 'solid' }) => {
    switch (variant) {
      case 'dashed':
        return css`
          background: repeating-linear-gradient(
            to right,
            ${theme.colors.neutral[200]} 0,
            ${theme.colors.neutral[200]} 4px,
            transparent 4px,
            transparent 8px
          );
        `;
      case 'dotted':
        return css`
          background: repeating-linear-gradient(
            to right,
            ${theme.colors.neutral[200]} 0,
            ${theme.colors.neutral[200]} 2px,
            transparent 2px,
            transparent 4px
          );
        `;
    }
  }}
`;