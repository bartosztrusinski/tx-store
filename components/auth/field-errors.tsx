type Props = {
  errors: string[] | undefined;
};

export function FieldErrors({ errors }: Props) {
  return errors?.map((error, index) => (
    <span key={index} className='text-sm font-light text-destructive' aria-live='polite'>
      {error}
    </span>
  ));
}
