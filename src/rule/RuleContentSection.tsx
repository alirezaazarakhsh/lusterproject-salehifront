import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from '../components/Ornaments';

interface RuleFaqItem {
  id: number;
  numFa: string;
  question: string;
}

const RULE_FAQ_ITEMS: RuleFaqItem[] = [
  {
    id: 1,
    numFa: '۱',
    question: 'پشتیبانی لوستر صالحی به چه صورت است ؟',
  },
  {
    id: 2,
    numFa: '۲',
    question: 'همکاری در فروش چه شرایطی لازم است ؟',
  },
  {
    id: 3,
    numFa: '۳',
    question: 'مواد اولیه لوستر از کجا تامین میشود؟',
  },
  {
    id: 4,
    numFa: '۴',
    question: 'پیاده سازی عملکرد آبکاری لوستر صالحی به چه صورتی است ؟',
  },
  {
    id: 5,
    numFa: '۵',
    question: 'پشتیبانی لوستر صالحی به چه صورت است ؟',
  },
  {
    id: 6,
    numFa: '۶',
    question: 'همکاری در فروش چه شرایطی لازم است ؟',
  },
  {
    id: 7,
    numFa: '۷',
    question: 'مواد اولیه لوستر از کجا تامین میشود؟',
  },
  {
    id: 8,
    numFa: '۸',
    question: 'پیاده سازی عملکرد آبکاری لوستر صالحی به چه صورتی است ؟',
  },
];

interface RuleContentSectionProps {
  faqSettings?: any;
}

/**
 * بخش محتوای میانی صفحه قوانین و مقررات (/rule)
 * دقیقاً مطابق طرح دسکتاپ و موبایل و حالت باز شدن آکاردئون (Screenshot 2026-09-30 at 23.50.37.png)
 */
export const RuleContentSection = ({ faqSettings = { faqs: { about: [], rules: [] } } }: RuleContentSectionProps) => {
  const [openFaqId, setOpenFaqId] = useState<number | string | null>(null);
  const [showMoreMobileFaq, setShowMoreMobileFaq] = useState(false);

  const effectiveRuleFaqs = faqSettings?.faqs?.rules || [];

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
      {/* ==================== ۱. بخش «قوانین و مقرارت لوستر صالحی» ==================== */}
      <section>
        <SectionHeading
          title="قوانین و مقرارت لوستر صالحی"
          className="mb-7 sm:mb-10"
        />

        {/* متن دسکتاپ */}
        <p
          className="hidden md:block text-[15px] lg:text-[16px] leading-[2.45] text-[#444444] text-justify"
          style={{ textAlignLast: 'right' }}
        >
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
        </p>

        {/* متن موبایل مطابق عکس دوم */}
        <p
          className="block md:hidden text-[14px] sm:text-[14.5px] leading-[2.3] text-[#444444] text-justify"
          style={{ textAlignLast: 'right' }}
        >
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است قرار گیرد.
        </p>
      </section>

      {/* ==================== ۲. بخش «شرایط تحویل محصولات» ==================== */}
      <section className="mt-12 sm:mt-16">
        <SectionHeading
          title="شرایط تحویل محصولات"
          className="mb-8 sm:mb-12"
        />

        <div className="space-y-9 sm:space-y-11">
          {/* مورد ۱: بسته‌بندی دقیق و ایمن لوستر شما */}
          <div>
            <div className="flex items-center justify-start gap-2.5 mb-3.5">
              <span className="w-[3.5px] h-5.5 sm:h-6 rounded-full bg-[#b08c57] shrink-0" />
              <h3 className="text-[16.5px] sm:text-[18px] lg:text-[19px] font-bold text-[#1e1e1e]">
                بسته‌بندی دقیق و ایمن لوستر شما
              </h3>
            </div>

            {/* متن دسکتاپ با عبارت طلایی «شرایط فعلی تکنولوژی» */}
            <p
              className="hidden md:block text-[15px] lg:text-[16px] leading-[2.45] text-[#444444] text-justify"
              style={{ textAlignLast: 'right' }}
            >
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای{' '}
              <span className="text-[#b08c57] font-medium">
                شرایط فعلی تکنولوژی
              </span>{' '}
              مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده است.
            </p>

            {/* متن موبایل مطابق عکس دوم */}
            <p
              className="block md:hidden text-[14px] sm:text-[14.5px] leading-[2.3] text-[#444444] text-justify"
              style={{ textAlignLast: 'right' }}
            >
              گالری لوستر صالحی خدماتی شامل تعمیر لوستر آینه و کنسول، لوازم برنزی دکوری، آبکاری انواع لوستر آینه و کنسول و شمعدان برنزی ،نقره ای ، طلایی ، آنتیک نصب لوستر طبقاتی و نصب کلاب لوستر در سقف های یونولیت مجهز به نردبان هیدرولیکی به متر 12 . محدوده نصب خدمات تهران، کرج، لواسانات را برای شما مشتریان عزیز انجام میدهد. لوستر صالحی با بیش از 18 سال سابقه کاری در صنعت لوستر ایران دارای رزومه کاری فرودگاه امام خمینی ، مسجد فخر آباد مسجد چهارده معصوم و انواع مساجد سینما آستارای تجریش و غیره آماده ارائه خدمات برای شما مشتریان عزیز می باشد.
            </p>
          </div>

          {/* مورد ۲: شاهکار لوستر دست زمان میبرد */}
          <div>
            <div className="flex items-center justify-start gap-2.5 mb-3.5">
              <span className="w-[3.5px] h-5.5 sm:h-6 rounded-full bg-[#b08c57] shrink-0" />
              <h3 className="text-[16.5px] sm:text-[18px] lg:text-[19px] font-bold text-[#1e1e1e]">
                شاهکار لوستر دست زمان میبرد
              </h3>
            </div>

            <p
              className="hidden md:block text-[15px] lg:text-[16px] leading-[2.45] text-[#444444] text-justify"
              style={{ textAlignLast: 'right' }}
            >
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
            </p>

            <p
              className="block md:hidden text-[14px] sm:text-[14.5px] leading-[2.3] text-[#444444] text-justify"
              style={{ textAlignLast: 'right' }}
            >
              گالری لوستر صالحی خدماتی شامل تعمیر لوستر آینه و کنسول، لوازم برنزی دکوری، آبکاری انواع لوستر آینه و کنسول و شمعدان برنزی ،نقره ای ، طلایی ، آنتیک نصب لوستر طبقاتی و نصب کلاب لوستر در سقف های یونولیت مجهز میباشد.
            </p>
          </div>

          {/* مورد ۳: خدمات استثنایی، در هر قدم از پیاده سازی */}
          <div>
            <div className="flex items-center justify-start gap-2.5 mb-3.5">
              <span className="w-[3.5px] h-5.5 sm:h-6 rounded-full bg-[#b08c57] shrink-0" />
              <h3 className="text-[16.5px] sm:text-[18px] lg:text-[19px] font-bold text-[#1e1e1e]">
                خدمات استثنایی، در هر قدم از پیاده سازی
              </h3>
            </div>

            <p
              className="hidden md:block text-[15px] lg:text-[16px] leading-[2.45] text-[#444444] text-justify"
              style={{ textAlignLast: 'right' }}
            >
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
            </p>

            <p
              className="block md:hidden text-[14px] sm:text-[14.5px] leading-[2.3] text-[#444444] text-justify"
              style={{ textAlignLast: 'right' }}
            >
              گالری لوستر صالحی خدماتی شامل تعمیر لوستر آینه و کنسول، لوازم برنزی دکوری، آبکاری انواع لوستر آینه و کنسول و شمعدان برنزی ،نقره ای ، طلایی ، آنتیک نصب لوستر طبقاتی و نصب کلاب لوستر در سقف های یونولیت مجهز میباشد.
            </p>
          </div>
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
