export type ActionFieldErrors<TField extends string = string> = Partial<
  Record<TField, string[]>
>;

export type ActionResult<TData = undefined, TField extends string = string> =
  | { success: true; data?: TData; message?: string }
  | {
      success: false;
      message: string;
      fieldErrors?: ActionFieldErrors<TField>;
    };

export const initialActionResult: ActionResult = {
  success: false,
  message: "",
};
