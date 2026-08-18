import { FC, ComponentProps } from 'react';
import { Button as UiButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonProps extends ComponentProps<typeof UiButton> {
  className?: string;
}

const Button: FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <UiButton
      variant="glass"
      className={cn('size-10 p-0 rounded-full', className)}
      {...props}
    >
      {children}
    </UiButton>
  );
};

export default Button;
