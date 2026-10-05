/**
 * تبدیل ارقام انگلیسی یا عربی به ارقام فارسی استاندارد
 */
export const toPersianDigits = (val: string | number): string => {
  if (val === null || val === undefined) return '';
  const str = String(val);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str
    .replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)])
    .replace(/[٠-٩]/g, (w) => persianDigits['٠١٢٣٤٥٦٧٨٩'.indexOf(w)]);
};
