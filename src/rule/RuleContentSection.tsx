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
 * اتصال کامل تمامی بخش‌ها و سوالات متداول به دیتابیس،
 * نمایش کامل و بدون خلاصه متون در نسخه موبایل و اصلاح شماره‌گذاری دو ستونه
 */
export const RuleContentSection = ({ faqSettings: propFaqSettings = { faqs: { about: [], rules: [] } }, ruleSettings: propRuleSettings }: RuleContentSectionProps) => {
  const [openFaqId, setOpenFaqId] = useState<number | string | null>(null);
  const [liveFaq, setLiveFaq] = useState<any>(propFaqSettings);
  const [liveRule, setLiveRule] = useState<any>(propRuleSettings);

  useEffect(() => {
    if (propFaqSettings) setLiveFaq(propFaqSettings);
  }, [propFaqSettings]);

  useEffect(() => {
    if (propRuleSettings) setLiveRule(propRuleSettings);
  }, [propRuleSettings]);

  // دریافت مستقیم تنظیمات زنده از دیتابیس در هنگام بارگذاری صفحه
  useEffect(() => {
    let isMounted = true;
    const fetchLiveSettingsFromDb = async () => {
      try {
        const [ruleRes, faqRes] = await Promise.all([
          apiFetchWithFallback('/api/public/settings/rule'),
          apiFetchWithFallback('/api/public/settings/faq'),
        ]);
        if (!isMounted) return;
        if (ruleRes && (ruleRes.ruleTitle || ruleRes.deliveryTitle)) {
          setLiveRule(ruleRes);
        }
        if (faqRes && faqRes.faqs) {
          setLiveFaq(faqRes);
        }
      } catch {
        try {
          const catalog = await apiFetchWithFallback('/api/public/catalog');
          if (!isMounted) return;
          if (catalog?.ruleSettings) setLiveRule(catalog.ruleSettings);
          if (catalog?.faqSettings) setLiveFaq(catalog.faqSettings);
        } catch {}
      }
    };

    fetchLiveSettingsFromDb();

    const handleUpdate = async () => {
      fetchLiveSettingsFromDb();
    };

    window.addEventListener('app-catalog-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('app-catalog-updated', handleUpdate);
    };
  }, []);

  const faqSettings = liveFaq || propFaqSettings;
  const ruleSettings = liveRule || propRuleSettings || INITIAL_RULE_SETTINGS;

  const effectiveRuleTitle = ruleSettings?.ruleTitle || INITIAL_RULE_SETTINGS.ruleTitle;
  const effectiveRuleDesc = ruleSettings?.ruleDescription || INITIAL_RULE_SETTINGS.ruleDescription;
  const effectiveRuleMobileDesc = (ruleSettings?.ruleMobileDescription && ruleSettings.ruleMobileDescription.trim().length > 20)
    ? ruleSettings.ruleMobileDescription
    : effectiveRuleDesc;

  const effectiveDeliveryTitle = ruleSettings?.deliveryTitle || INITIAL_RULE_SETTINGS.deliveryTitle;
  const effectiveDeliveryItems = Array.isArray(ruleSettings?.deliveryItems) && ruleSettings.deliveryItems.length > 0
    ? ruleSettings.deliveryItems
    : INITIAL_RULE_SETTINGS.deliveryItems;

  const rawRuleFaqs =
    Array.isArray(faqSettings?.faqs?.rules)
      ? faqSettings.faqs.rules
      : (Array.isArray(faqSettings?.faqs?.rule)
         ? faqSettings.faqs.rule
         : INITIAL_FAQ_SETTINGS.faqs.rules);

  const effectiveRuleFaqs = Array.isArray(rawRuleFaqs)
    ? rawRuleFaqs
    : INITIAL_FAQ_SETTINGS.faqs.rules;

  const toggleFaq = (id: number | string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  // تقسیم دو ستونه زنده و متوازن برای دسکتاپ (نیمه اول ستون راست، نیمه دوم ستون چپ)
  const halfCount = Math.ceil(effectiveRuleFaqs.length / 2);
  const rightColumnFaqs = effectiveRuleFaqs.slice(0, halfCount);
  const leftColumnFaqs = effectiveRuleFaqs.slice(halfCount);

  const toPersianDigits = (val: string | number): string =>
    String(val).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

  const renderFaqAccordionRow = (item: any, displayIndex: number) => {
    const isOpen = openFaqId === item.id;
    const itemNumFa = toPersianDigits(displayIndex + 1);

    return (
      <div
        key={item.id || displayIndex}
        className="border-b border-[#eaeaea] py-4 sm:py-4.5 transition-all"
      >
        <button
          type="button"
          onClick={() => toggleFaq(item.id)}
          className="w-full flex items-center justify-between gap-3.5 sm:gap-4 text-right cursor-pointer group focus:outline-none select-none"
        >
          {/* سمت راست: کادر شماره + متن سوال در یک مجموعه یکپارچه */}
          <div className="flex items-center justify-start gap-3.5 min-w-0">
            <span
              className={`w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] rounded-[12px] flex items-center justify-center text-[15px] sm:text-[16px] font-bold tabular-nums shrink-0 transition-colors ${
                isOpen
                  ? 'border-[1.5px] border-[#a88453] bg-[#f5efe6] text-[#8e6b3a]'
                  : 'border border-[#e5e5e5] bg-white text-[#1e1e1e] shadow-[0_1px_2px_rgba(0,0,0,0.02)] group-hover:border-[#a88453]'
              }`}
            >
              {itemNumFa}
            </span>

            <span className="text-[14px] sm:text-[15px] lg:text-[16px] font-bold text-[#1e1e1e] group-hover:text-[#b08c57] transition-colors text-right break-words leading-relaxed">
              {item.question}
            </span>
          </div>

          {/* سمت چپ: آیکون فلش چرخشی */}
          <ChevronDown
            className={`w-4.5 h-4.5 text-[#1e1e1e] stroke-[2] shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#a88453]' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="pt-3 pb-2 text-[13.5px] sm:text-[14.5px] lg:text-[15px] leading-[2.2] text-[#666666] text-justify space-y-4 break-words mr-3 sm:mr-4 pr-3.5 border-r-2 border-[#a88453]/40">
            <p style={{ textAlignLast: 'right' }}>
              {item.answer}
            </p>
          </div>
        )}
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
          className="hidden md:block text-[15px] lg:text-[16px] leading-[2.45] text-[#444444] text-justify break-words"
          style={{ textAlignLast: 'right' }}
        >
          {effectiveRuleDesc}
        </p>

        {/* متن موبایل - نمایش کامل و بدون خلاصه برای هر بخش */}
        <p
          className="block md:hidden text-[14px] sm:text-[14.5px] leading-[2.3] text-[#444444] text-justify break-words"
          style={{ textAlignLast: 'right' }}
        >
          {effectiveRuleDesc || effectiveRuleMobileDesc}
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
                className="hidden md:block text-[15px] lg:text-[16px] leading-[2.45] text-[#444444] text-justify break-words"
                style={{ textAlignLast: 'right' }}
              >
                {item.description}
              </p>

              {/* متن موبایل - نمایش متن کامل و دقیق برای هر بخش */}
              <p
                className="block md:hidden text-[14px] sm:text-[14.5px] leading-[2.3] text-[#444444] text-justify break-words"
                style={{ textAlignLast: 'right' }}
              >
                {item.description || item.mobileDescription}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== ۳. لیست سوالات متداول شماره‌دار در پایین صفحه ==================== */}
      {effectiveRuleFaqs.length > 0 && (
        <section className="mt-10 sm:mt-14">
          {/* حالت دسکتاپ: دو ستونه با چیدمان روان و مرتب */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-x-12 lg:gap-x-16">
            <div>
              {rightColumnFaqs.map((item: any, idx: number) =>
                renderFaqAccordionRow(item, idx)
              )}
            </div>
            <div>
              {leftColumnFaqs.map((item: any, idx: number) =>
                renderFaqAccordionRow(item, halfCount + idx)
              )}
            </div>
          </div>

          {/* حالت موبایل: تک ستونه با نمایش کامل تمامی سوالات متداول بدون جا ماندن */}
          <div className="block md:hidden">
            <div>
              {effectiveRuleFaqs.map((item: any, idx: number) =>
                renderFaqAccordionRow(item, idx)
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};
export default RuleContentSection;
