import { FC, ComponentProps } from 'react';
import { Button as UiButton } from '@/components/ui/button';

interface ButtonProps extends ComponentProps<typeof UiButton> {
  className?: string;
}

const Button: FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <UiButton variant="glass" className={className} {...props}>
      {children}
    </UiButton>
  );
};

export default Button;
