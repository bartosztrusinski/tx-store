type Props = {
  errors: string[] | undefined;
};

export function FieldErrors({ errors }: Props) {
  return errors?.map((error, index) => (
    <span aria-live='polite' className='text-sm font-light text-destructive' key={index}>
      {error}
    </span>
  ));
}
