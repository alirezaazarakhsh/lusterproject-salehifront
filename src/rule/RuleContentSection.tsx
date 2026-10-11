import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from '../components/Ornaments';
import { INITIAL_FAQ_SETTINGS, INITIAL_RULE_SETTINGS, apiFetchWithFallback } from '../utils/localBackendFallback';

interface RuleContentSectionProps {
  faqSettings?: any;
  ruleSettings?: any;
}

/**
 * بخش محتوای میانی صفحه قوانین و مقررات (/rule)
 * دقیقاً مطابق طرح دسکتاپ و موبایل و حالت باز شدن آکاردئون (Screenshot 2026-09-30 at 23.50.37.png)
 */
export const RuleContentSection = ({ faqSettings: propFaqSettings = { faqs: { about: [], rules: [] } }, ruleSettings: propRuleSettings }: RuleContentSectionProps) => {
  const [openFaqId, setOpenFaqId] = useState<number | string | null>(null);
  const [showMoreMobileFaq, setShowMoreMobileFaq] = useState(false);
  const [liveFaq, setLiveFaq] = useState<any>(propFaqSettings);
  const [liveRule, setLiveRule] = useState<any>(propRuleSettings);

  useEffect(() => {
    if (propFaqSettings) setLiveFaq(propFaqSettings);
  }, [propFaqSettings]);

  useEffect(() => {
    if (propRuleSettings) setLiveRule(propRuleSettings);
  }, [propRuleSettings]);

  useEffect(() => {
    const handleUpdate = async () => {
      try {
        const data = await apiFetchWithFallback('/api/public/catalog');
        if (data?.faqSettings) setLiveFaq(data.faqSettings);
        if (data?.ruleSettings) setLiveRule(data.ruleSettings);
      } catch {}
    };
    window.addEventListener('app-catalog-updated', handleUpdate);
    return () => window.removeEventListener('app-catalog-updated', handleUpdate);
  }, []);

  const faqSettings = liveFaq || propFaqSettings;
  const ruleSettings = liveRule || propRuleSettings || INITIAL_RULE_SETTINGS;

  const effectiveRuleTitle = ruleSettings?.ruleTitle || INITIAL_RULE_SETTINGS.ruleTitle;
  const effectiveRuleDesc = ruleSettings?.ruleDescription || INITIAL_RULE_SETTINGS.ruleDescription;
  const effectiveRuleMobileDesc = ruleSettings?.ruleMobileDescription || INITIAL_RULE_SETTINGS.ruleMobileDescription;
  const effectiveDeliveryTitle = ruleSettings?.deliveryTitle || INITIAL_RULE_SETTINGS.deliveryTitle;
  const effectiveDeliveryItems = Array.isArray(ruleSettings?.deliveryItems) && ruleSettings.deliveryItems.length > 0
    ? ruleSettings.deliveryItems
    : INITIAL_RULE_SETTINGS.deliveryItems;

  const effectiveRuleFaqs =
    Array.isArray(faqSettings?.faqs?.rules) && faqSettings.faqs.rules.length > 0
      ? faqSettings.faqs.rules
      : INITIAL_FAQ_SETTINGS.faqs.rules;

  const toggleFaq = (id: number | string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const rightColumnFaqs = effectiveRuleFaqs.slice(0, Math.ceil(effectiveRuleFaqs.length / 2));
  const leftColumnFaqs = effectiveRuleFaqs.slice(Math.ceil(effectiveRuleFaqs.length / 2));
  const mobileVisibleFaqs = showMoreMobileFaq
    ? effectiveRuleFaqs
    : effectiveRuleFaqs.slice(0, 4);

  const toPersianDigits = (val: string | number): string =>
    String(val).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

  const renderFaqAccordionRow = (item: any, idx: number) => {
    const isOpen = openFaqId === item.id;
    const itemNumFa = toPersianDigits(idx + 1);
    return (
      <div
        key={item.id || idx}
        className="border-b border-[#eaeaea] py-4.5 sm:py-5 transition-all"
      >
        <div className="flex items-stretch gap-3.5 sm:gap-4">
          {/* ستون سمت راست: کادر شماره + خط چین عمودی طلایی در حالت باز (مطابق عکس) */}
          <div className="flex flex-col items-center shrink-0">
            <button
              type="button"
              onClick={() => toggleFaq(item.id)}
              className={`w-[46px] h-[46px] rounded-[12px] flex items-center justify-center text-[15.5px] lg:text-[16px] font-bold tabular-nums transition-colors cursor-pointer ${
                isOpen
                  ? 'border-[1.5px] border-[#a88453] bg-[#f5efe6] text-[#8e6b3a]'
                  : 'border border-[#e5e5e5] bg-white text-[#1e1e1e] shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
              }`}
            >
              {itemNumFa}
            </button>

            {isOpen && (
              <div
                aria-hidden="true"
                className="flex-1 flex flex-col items-center justify-between pt-3 pb-1.5 min-h-[140px]"
              >
                <span className="w-[1.8px] h-2.5 rounded-full bg-[#a88453]" />
                <span className="w-[1.8px] h-4.5 rounded-full bg-[#a88453]" />
                <span className="w-[1.8px] h-4.5 rounded-full bg-[#a88453]" />
                <span className="w-[1.8px] h-4.5 rounded-full bg-[#a88453]" />
                <span className="w-[1.8px] h-2.5 rounded-full bg-[#a88453]" />
              </div>
            )}
          </div>

          {/* ستون سمت چپ: عنوان سوال، آیکون فلش و متن توضیحات دو پاراگرافی در حالت باز */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <button
              type="button"
              onClick={() => toggleFaq(item.id)}
              className="w-full min-h-[46px] flex items-center justify-between gap-3 text-right cursor-pointer group"
            >
              <span className="text-[14.5px] sm:text-[15.5px] lg:text-[16px] font-bold text-[#1e1e1e] group-hover:text-[#b08c57] transition-colors truncate">
                {item.question}
              </span>

              <ChevronDown
                className={`w-4.5 h-4.5 text-[#1e1e1e] stroke-[1.9] shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="pt-2.5 pb-1 text-[13.5px] sm:text-[14.5px] lg:text-[15px] leading-[2.2] text-[#666666] text-justify space-y-4">
                <p style={{ textAlignLast: 'right' }}>
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-14 xl:px-20 pt-8 sm:pt-12 pb-12 sm:pb-20">
      {/* ==================== ۱. بخش «قوانین و مقرارت» ==================== */}
      <section>
        <SectionHeading
          title={effectiveRuleTitle}
          className="mb-7 sm:mb-10"
        />

        {/* متن دسکتاپ */}
        <p
          className="hidden md:block text-[15px] lg:text-[16px] leading-[2.45] text-[#444444] text-justify"
          style={{ textAlignLast: 'right' }}
        >
          {effectiveRuleDesc}
        </p>

        {/* متن موبایل */}
        <p
          className="block md:hidden text-[14px] sm:text-[14.5px] leading-[2.3] text-[#444444] text-justify"
          style={{ textAlignLast: 'right' }}
        >
          {effectiveRuleMobileDesc}
        </p>
      </section>

      {/* ==================== ۲. بخش «شرایط تحویل محصولات» با اقلام دینامیک ==================== */}
      <section className="mt-12 sm:mt-16">
        <SectionHeading
          title={effectiveDeliveryTitle}
          className="mb-8 sm:mb-12"
        />

        <div className="space-y-9 sm:space-y-11">
          {effectiveDeliveryItems.map((item: any, idx: number) => (
            <div key={item.id || idx}>
              <div className="flex items-center justify-start gap-2.5 mb-3.5">
                <span className="w-[3.5px] h-5.5 sm:h-6 rounded-full bg-[#b08c57] shrink-0" />
                <h3 className="text-[16.5px] sm:text-[18px] lg:text-[19px] font-bold text-[#1e1e1e]">
                  {item.title}
                </h3>
              </div>

              {/* متن دسکتاپ */}
              <p
                className="hidden md:block text-[15px] lg:text-[16px] leading-[2.45] text-[#444444] text-justify"
                style={{ textAlignLast: 'right' }}
              >
                {item.description}
              </p>

              {/* متن موبایل */}
              <p
                className="block md:hidden text-[14px] sm:text-[14.5px] leading-[2.3] text-[#444444] text-justify"
                style={{ textAlignLast: 'right' }}
              >
                {item.mobileDescription || item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== ۳. لیست سوالات متداول شماره‌دار در پایین صفحه ==================== */}
      {effectiveRuleFaqs.length > 0 && (
        <section className="mt-10 sm:mt-14">
          {/* حالت دسکتاپ: دو ستونه (ستون راست ۱ تا ۴، ستون چپ ۵ تا ۸) */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-x-12 lg:gap-x-16">
            <div>{rightColumnFaqs.map((item: any, idx: number) => renderFaqAccordionRow(item, idx))}</div>
            <div>{leftColumnFaqs.map((item: any, idx: number) => renderFaqAccordionRow(item, idx + rightColumnFaqs.length))}</div>
          </div>

          {/* حالت موبایل: تک ستونه (۱ تا ۴ به صورت پیش‌فرض + دکمه «نمایش سوالات بیشتر») */}
          <div className="block md:hidden">
            <div>{mobileVisibleFaqs.map((item: any, idx: number) => renderFaqAccordionRow(item, idx))}</div>

            {effectiveRuleFaqs.length > 4 && (
              <button
                type="button"
                onClick={() => setShowMoreMobileFaq((prev) => !prev)}
                className="mt-7 mx-auto block text-[14.5px] font-medium text-[#8e8e8e] hover:text-[#1e1e1e] transition-colors cursor-pointer"
              >
                {showMoreMobileFaq ? 'بستن سوالات بیشتر' : 'نمایش سوالات بیشتر'}
              </button>
            )}
          </div>
        </section>
      )}
    </main>
  );
};
export default RuleContentSection;
