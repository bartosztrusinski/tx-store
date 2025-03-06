type Props = {
  errors: string[] | undefined;
};

export function FieldErrors({ errors }: Props) {
  return errors?.map((error, index) => (
    <span key={index} className='px-1 text-sm font-light text-red-500' aria-live='polite'>
      {error}
    </span>
  ));
}
