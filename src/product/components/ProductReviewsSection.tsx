import React, { useState } from 'react';
import { Star, MessageSquarePlus, X } from 'lucide-react';
import { toPersianDigits } from '../../utils/persianDigits';

export interface UserReview {
  id: string;
  authorName: string;
  avatarUrl: string;
  dateStr: string;
  timeStr: string;
  rating: number;
  comment: string;
}

interface ProductReviewsSectionProps {
  reviewsList: UserReview[];
  onOpenAddReviewModal: () => void;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  reviewsList,
  onOpenAddReviewModal,
}) => {
  return (
    <div className="mt-16 sm:mt-24 pt-12 border-t border-[#e8ded0]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-[#1a1a1a]">
            نظرات و پرسش‌های مشتریان
          </h3>
          <p className="text-xs text-[#777] mt-1">
            تجربیات خرید و استفاده از این محصول توسط خریداران محترم
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddReviewModal}
          className="px-5 py-3 rounded-2xl bg-[#faf6ef] hover:bg-[#f3ece1] border border-[#e8dfcf] text-[#a98552] font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <MessageSquarePlus className="w-4.5 h-4.5" />
          <span>ثبت نظر جدید درباره این محصول</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviewsList.map((rev) => (
          <div
            key={rev.id}
            className="rounded-[24px] border border-[#e8ded0] bg-white p-6 space-y-4 shadow-2xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={rev.avatarUrl}
                  alt={rev.authorName}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border border-[#e5dec9]"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-[#1a1a1a]">
                    {rev.authorName}
                  </h4>
                  <span className="text-[11px] text-[#888] tabular-nums">
                    {rev.dateStr} · {rev.timeStr}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#fffbf2] border border-[#f2e7d0] px-3 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                <span className="text-xs font-black text-[#222] tabular-nums">
                  {toPersianDigits(rev.rating)}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#555] leading-relaxed text-justify">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
