import clsx from 'clsx';

type SpinLoaderProps = {
  className?: string;
};

export function SpinLoader({ className = '' }: SpinLoaderProps) {
  const classes = clsx('flex', 'items-center', 'justify-center', className);

  return (
    <div className={classes}>
      <div
        className={clsx(
          'h-10 w-10',
          'border-5 border-slate-900 border-t-transparent',
          'rounded-full',
          'animate-spin'
        )}
      ></div>
    </div>
  );
}
