import React from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import { toPersianDigits } from '../../utils/persianDigits';

interface ProductModalsProps {
  isFeaturesModalOpen: boolean;
  onCloseFeaturesModal: () => void;
  isAddReviewModalOpen: boolean;
  onCloseAddReviewModal: () => void;
  newReviewAuthor: string;
  setNewReviewAuthor: (val: string) => void;
  newReviewComment: string;
  setNewReviewComment: (val: string) => void;
  newReviewRating: number;
  setNewReviewRating: (val: number) => void;
  onSubmitReview: (e: React.FormEvent) => void;
}

export const ProductModals: React.FC<ProductModalsProps> = ({
  isFeaturesModalOpen,
  onCloseFeaturesModal,
  isAddReviewModalOpen,
  onCloseAddReviewModal,
  newReviewAuthor,
  setNewReviewAuthor,
  newReviewComment,
  setNewReviewComment,
  newReviewRating,
  setNewReviewRating,
  onSubmitReview,
}) => {
  const fifteenFeatures = [
    'ضمانت کتبی مادام‌العمر ثبات رنگ و آبکاری بدنه',
    'استفاده از برنج خالص درجه یک و آلیاژ استاندارد',
    'کریستال‌های ۱۰۰٪ اصل اتریشی و چک با بازتاب نور منشوری',
    'سرپیچ‌های سرامیکی نسوز استاندارد با قابلیت تحمل حرارت بالا',
    'مجهز به سیستم نصب آسان در انواع سقف‌های کاذب و یونولیت',
    'دارای تاییدیه استاندارد ملی و گواهینامه کیفیت اروپا CE',
    'بسته‌بندی تخصصی ضد ضربه با پوششکیوم فشرده جهت ارسال امن',
    'پشتیبانی ۲۴ ساعته و مشاوره رایگان دکوراسیون داخلی',
    'امکان سفارشی‌سازی ابعاد، تعداد شاخه‌ها و رنگ آبکاری',
    'مقاومت کامل در برابر رطوبت و شرایط آب و هوایی شرجی',
    'سیم‌کشی داخلی تمام مس استاندارد با پوشش عایق نسوز',
    'طراحی انحصاری توسط استودیو معماری صالحی',
    'ارسال به سراسر کشور با بیمه کامل باربری',
    'خدمات پس از فروش شامل شستشو و بازسازی دوره‌ای',
    'امکان بازدید حضوری از نمونه واقعی در گالری مرکزی تهران',
  ];

  return (
    <>
      {/* مودال ۱۵ ویژگی */}
      {isFeaturesModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={onCloseFeaturesModal}
          dir="rtl"
        >
          <div
            className="w-full max-w-2xl bg-[#fcfbf9] rounded-3xl border border-[#e5dec9] shadow-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#ebdcb9]">
              <h3 className="text-lg font-black text-[#1a1a1a]">
                ۱۵ ویژگی انحصاری ساختاری و استانداردهای محصول
              </h3>
              <button
                type="button"
                onClick={onCloseFeaturesModal}
                className="w-8 h-8 rounded-full bg-[#f4f3ef] hover:bg-[#2b2b2b] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              {fifteenFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#f0eee8] shadow-2xs"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#b59766] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-bold text-[#333] leading-relaxed text-right">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* مودال ثبت نظر */}
      {isAddReviewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={onCloseAddReviewModal}
          dir="rtl"
        >
          <div
            className="w-full max-w-lg bg-[#fcfbf9] rounded-3xl border border-[#e5dec9] shadow-2xl p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#ebdcb9]">
              <h3 className="text-lg font-black text-[#1a1a1a]">
                ثبت نظر جدید درباره این محصول
              </h3>
              <button
                type="button"
                onClick={onCloseAddReviewModal}
                className="w-8 h-8 rounded-full bg-[#f4f3ef] hover:bg-[#2b2b2b] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={onSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#444] mb-1.5 text-right">
                  نام و نام خانوادگی شما:
                </label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="مثال: علیرضا کریمی"
                  className="w-full h-12 px-4 rounded-2xl bg-white border border-[#e5dec9] text-xs font-bold text-[#111] focus:outline-none focus:border-[#b59766]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#444] mb-1.5 text-right">
                  امتیاز شما به محصول (از ۵):
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                        newReviewRating >= star ? 'text-[#d4af37]' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#555] tabular-nums mr-2">
                    {toPersianDigits(newReviewRating)} از ۵
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#444] mb-1.5 text-right">
                  متن نظر یا تجربه استفاده:
                </label>
                <textarea
                  required
                  rows={4}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="نظر خود را درباره کیفیت ساخت، نوردهی، زیبایی و نصب لوستر بنویسید..."
                  className="w-full p-4 rounded-2xl bg-white border border-[#e5dec9] text-xs font-medium text-[#111] focus:outline-none focus:border-[#b59766] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-[#1a1a1a] hover:bg-black text-white font-extrabold text-xs flex items-center justify-center transition-colors cursor-pointer shadow-md mt-4"
              >
                ارسال و انتشار نظر
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
