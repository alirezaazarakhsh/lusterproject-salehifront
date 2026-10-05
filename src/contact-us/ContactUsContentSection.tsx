import React, { useState, useRef } from 'react';
import { SectionHeading } from '../components/Ornaments';
import { AppToast } from '../components/InteractiveModals';
import { addMessageToFirestore } from '../lib/firestoreSync';

export interface ContactUsBranchLocationItem {
  id: string;
  branchTitle: string;
  address: string;
  neshanUrl: string;
}

export interface ContactUsBranchPhoneItem {
  id: string;
  title: string;
  phone: string;
}

export interface ContactUsSettingsConfig {
  supportTitle: string;
  supportValue: string;
  workingDaysTitle: string;
  workingDaysHours: string;
  holidaysTitle: string;
  holidaysHours: string;
  emailTitle: string;
  emailAddress: string;
  managerPhoneTitle: string;
  managerPhone: string;
  landlinePhoneTitle: string;
  landlinePhone: string;
  branchLocations: ContactUsBranchLocationItem[];
  branchPhones: ContactUsBranchPhoneItem[];
}

interface ContactUsContentSectionProps {
  contactUsSettings?: ContactUsSettingsConfig;
  onShowToast?: (
    type: AppToast['type'],
    title: string,
    message: string,
    onComplete?: () => void
  ) => void;
}

const toPersianDigits = (val: string | number): string =>
  String(val).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

/**
 * ۱. آیکون ساعت (clock.png) - دقیقاً مطابق وکتور ارسالی
 */
const ClockVectorIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ۲. آیکون تقویم (calendar.png) - دقیقاً مطابق وکتور ارسالی
 */
const CalendarVectorIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8 2V5"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 2V5"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.5 9.08997H20.5"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.6947 13.7H15.7037"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.6947 16.7H15.7037"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.9955 13.7H12.0045"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.9955 16.7H12.0045"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.29431 13.7H8.30329"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.29431 16.7H8.30329"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ۳. آیکون تماس تلفنی (call-calling.png) - دقیقاً مطابق وکتور ارسالی
 */
const CallCallingVectorIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.31 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeMiterlimit="10"
    />
    <path
      d="M18.5 9C18.5 8.4 18.03 7.48 17.33 6.73C16.69 6.04 15.84 5.5 15 5.5"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 9C22 5.13 18.87 2 15 2"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ۴. آیکون تاج مدیریت (crown.png) - دقیقاً مطابق وکتور ارسالی
 */
const CrownVectorIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16.7 18.98H7.3C6.88 18.98 6.41 18.65 6.27 18.25L2.13 6.67C1.54 5.01 2.23 4.5 3.65 5.52L7.55 8.31C8.2 8.76 8.94 8.53 9.22 7.8L10.98 3.11C11.54 1.61 12.47 1.61 13.03 3.11L14.79 7.8C15.07 8.53 15.81 8.76 16.45 8.31L20.11 5.7C21.67 4.58 22.42 5.15 21.78 6.96L17.74 18.27C17.59 18.65 17.12 18.98 16.7 18.98Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 22H17.5"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 14H14.5"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ۵. آیکون گفتگو / پشتیبانی (messages.png) - دقیقاً مطابق وکتور ارسالی
 */
const MessagesVectorIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M22 6.25V11.35C22 12.62 21.58 13.69 20.83 14.43C20.09 15.18 19.02 15.6 17.75 15.6V17.41C17.75 18.09 16.99 18.5 16.43 18.12L15.46 17.48C15.55 17.17 15.59 16.83 15.59 16.47V12.4C15.59 10.36 14.23 9 12.19 9H5.4C5.26 9 5.13 9.01 5 9.02V6.25C5 3.7 6.7 2 9.25 2H17.75C20.3 2 22 3.7 22 6.25Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.59 12.4V16.47C15.59 17.56 15.09 18.42 14.24 18.92C13.68 19.26 12.99 19.43 12.19 19.43H9.47L6.45 21.45C5.93 21.8 5.25 21.42 5.25 20.8V19.43C4.29 19.43 3.49 19.12 2.91 18.54C2.31 17.95 2 17.15 2 16.18V12.4C2 10.5 3.18 9.19 5 9.02C5.13 9.01 5.26 9 5.4 9H12.19C14.23 9 15.59 10.36 15.59 12.4Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.6 14.2H6.61"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.8 14.2H8.81"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 14.2H11.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ۶. آیکون لوکیشن تیک‌دار (location-tick.png) - دقیقاً مطابق وکتور ارسالی
 */
const LocationTickVectorIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3.62 8.49C5.59 -0.17 18.42 -0.16 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z"
      stroke="currentColor"
      strokeWidth="1.65"
    />
    <path
      d="M9.25 11.5L10.75 13L14.75 9"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ۷. آیکون ایمیل (sms.png) - دقیقاً مطابق وکتور ارسالی
 */
const SmsVectorIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * لوگوی رنگی «نشان» داخل دکمه «لوکیشن با نشان» مطابق تصویر اول و نهم
 */
const NeshanMapLogo: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    {/* نیمه سرمه‌ای تیره بالا-چپ */}
    <path
      d="M5.2 22.8 C3.1 17.9 4.1 10.9 8.1 6.9 C12.1 2.9 18.5 2.9 22.3 6.7 L5.2 22.8 Z"
      fill="#1b3042"
    />
    {/* نیمه قرمز پایین-راست */}
    <path
      d="M22.3 6.7 C26.1 10.5 26.1 16.9 22.1 20.9 C18.1 24.9 11.1 25.9 5.2 22.8 L22.3 6.7 Z"
      fill="#e52535"
    />
    {/* دایره سفید میانی */}
    <circle cx="15" cy="13.8" r="6.1" fill="#ffffff" />
    {/* نقطه فیروزه‌ای مرکزی نشان */}
    <circle cx="15" cy="13.8" r="3.6" fill="#27bda0" />
  </svg>
);

interface BranchLocationItem {
  id: string;
  branchTitle: string;
  address: string;
  neshanUrl: string;
}

const SALEHI_BRANCH_LOCATIONS: BranchLocationItem[] = [
  {
    id: 'branch-lalehzar',
    branchTitle: 'شعبه لاله زار :',
    address: 'لاله زار نو خیابان امین زاده پاساژ پردیس طبقه ۴ پلاک ۳',
    neshanUrl: 'https://neshan.org',
  },
  {
    id: 'branch-shariati',
    branchTitle: 'شعبه شریعتی :',
    address:
      'خیابان ظفر، خیابان گوی آبادی، خیابان پور اردکانی، خیابان قره گوزلو پلاک ۵',
    neshanUrl: 'https://neshan.org',
  },
  {
    id: 'branch-afsarieh',
    branchTitle: 'شعبه سه راه افسریه :',
    address:
      'افسریه مسعودیه خ اردیبهشت جنب پاساژ خانواده پلاک ۱۳۳۵ لوستر صالحی',
    neshanUrl: 'https://neshan.org',
  },
];

const SALEHI_BRANCH_PHONES = [
  {
    id: 'phone-lalehzar',
    title: 'شماره تلفن و واتساپ شعبه لاله زار نو :',
    phone: '۰۲۱-۳۳۳۳۳۶۳۲',
  },
  {
    id: 'phone-shariati',
    title: 'شماره تلفن و واتساپ شعبه شریعتی :',
    phone: '۰۲۱-۳۳۳۳۳۶۳۲',
  },
  {
    id: 'phone-afsarieh',
    title: 'شماره تلفن و واتساپ شعبه سه راه افسریه :',
    phone: '۰۲۱-۳۳۳۳۳۶۳۲',
  },
];

export const INITIAL_CONTACT_US_SETTINGS: ContactUsSettingsConfig = {
  supportTitle: 'پشتیبانی :',
  supportValue: 'بخش پاسخگویی تلفنی',
  workingDaysTitle: 'روز های کاری :',
  workingDaysHours: '۸ صبح الی ۸ شب',
  holidaysTitle: 'روز های تعطیل :',
  holidaysHours: '۸ صبح الی ۶ بعدظهر',
  emailTitle: 'آدرس ایمیل :',
  emailAddress: 'info@lostersalehi.ir',
  managerPhoneTitle: 'شماره مدیریت :',
  managerPhone: '۰۹۰۱۲۲۲۲۶۳۵',
  landlinePhoneTitle: 'شماره ثابت :',
  landlinePhone: '۰۲۱-۳۳۳۳۳۶۳۲',
  branchLocations: SALEHI_BRANCH_LOCATIONS,
  branchPhones: SALEHI_BRANCH_PHONES,
};

export const ContactUsContentSection: React.FC<
  ContactUsContentSectionProps
> = ({ contactUsSettings, onShowToast }) => {
  const settings: ContactUsSettingsConfig = {
    ...INITIAL_CONTACT_US_SETTINGS,
    ...(contactUsSettings || {}),
    branchLocations:
      contactUsSettings?.branchLocations &&
      contactUsSettings.branchLocations.length > 0
        ? contactUsSettings.branchLocations
        : INITIAL_CONTACT_US_SETTINGS.branchLocations,
    branchPhones:
      contactUsSettings?.branchPhones &&
      contactUsSettings.branchPhones.length > 0
        ? contactUsSettings.branchPhones
        : INITIAL_CONTACT_US_SETTINGS.branchPhones,
  };
  const [subject, setSubject] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [mobilePhone, setMobilePhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // شمارنده‌های تست برای نمایش هر ۳ وضعیت مودال در دسکتاپ و موبایل
  const emptyAttemptCountRef = useRef<number>(0);
  const filledAttemptCountRef = useRef<number>(0);

  const subjectCharCountDisplay = `${toPersianDigits(subject.length)} کاراکتر`;

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = fullName.trim();
    const trimmedPhone = mobilePhone.trim();
    const trimmedMsg = messageText.trim();
    const trimmedSubject = subject.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedPhone || !trimmedMsg || !trimmedSubject) {
      onShowToast?.(
        'contact-empty-error',
        'خطایی رخ داد!',
        'مشتری عزیز فیلدهای الزامی فرم تماس (نام، شماره تماس، موضوع و متن پیام) را تکمیل نمایید.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const messageData = {
        fullName: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMsg,
        status: 'new',
        createdAt: new Date().toISOString(),
      };

      const docId = await addMessageToFirestore(messageData);
      
      if (!docId) {
        throw new Error('خطا در ذخیره‌سازی پیام در دیتابیس');
      }

      onShowToast?.(
        'contact-success',
        'پیام شما با موفقیت ارسال شد',
        'پیام شما مستقیماً در دیتابیس اصلی ثبت شد.'
      );

      setFullName('');
      setMobilePhone('');
      setEmail('');
      setMessageText('');
      setSubject('');
    } catch (err) {
      console.error(err);
      onShowToast?.(
        'contact-send-error',
        'پیام شما ارسال نشد!',
        'لطفاً مجدد تلاش کنید.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-14 xl:px-20 pt-8 sm:pt-12 pb-12 sm:pb-20">
      {/* ==================== ۱. عنوان اصلی «راه ارتباطی با ما» و توضیحات زیر آن ==================== */}
      <section>
        <SectionHeading title="راه ارتباطی با ما" className="mb-6 sm:mb-8" />

        <p
          className="max-w-[1060px] mx-auto text-[13.5px] sm:text-[14.5px] lg:text-[15px] leading-[2.3] text-[#4a4a4a] text-justify md:text-center"
          style={{ textAlignLast: 'right' }}
        >
          <span className="md:hidden">
            تماس با لوستر صالحی، از طریق پورتال مشتریان، گفتگوی آنلاین و تماس
            تلفنی امکان پذیر است. بهترین و سریعترین روش، ارتباط از طریق پورتال
            مشتریان لوستر صالحی می باشد. چنانچه در پورتال مشتریان عضو هستید جهت
            استفاده می توانید فرم تکمیلی تماس را ارسال بفرمایید.
          </span>
        </p>
        <p className="hidden md:block max-w-[1060px] mx-auto text-[14.5px] lg:text-[15.5px] leading-[2.35] text-[#4a4a4a] text-center">
          تماس با لوستر صالحی، از طریق پورتال مشتریان، گفتگوی آنلاین و تماس تلفنی
          امکان پذیر است. بهترین و سریعترین روش، ارتباط از طریق پورتال مشتریان
          لوستر صالحی می باشد. چنانچه در پورتال مشتریان عضو هستید جهت استفاده می
          توانید فرم تکمیلی تماس را ارسال بفرمایید.
        </p>
      </section>

      {/* ==================== ۲. ردیف اول: «بخش فروش و امور مشتریان» و «تماس با ما» ==================== */}
      <section className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8">
        {/* ستون راست: بخش فروش و امور مشتریان */}
        <div>
          <div className="flex items-center justify-start gap-2.5 mb-4">
            <span className="w-[3.5px] h-5.5 rounded-full bg-[#b08c57] shrink-0" />
            <h3 className="text-[16px] sm:text-[17.5px] font-bold text-[#1e1e1e]">
              بخش فروش و امور مشتریان
            </h3>
          </div>

          <div className="rounded-[16px] border border-[#eaeaea] bg-white p-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4 items-center">
              {/* آیتم ۱: پشتیبانی */}
              <div className="flex items-center justify-start gap-3.5">
                <div className="w-[46px] h-[46px] rounded-[11px] bg-[#f4f1ea] text-[#a98552] flex items-center justify-center shrink-0">
                  <MessagesVectorIcon className="w-[22px] h-[22px]" />
                </div>
                <div className="text-right min-w-0">
                  <span className="block text-[12.5px] text-[#555555]">
                    {settings.supportTitle}
                  </span>
                  <span className="block text-[13px] sm:text-[13.5px] font-bold text-[#1e1e1e] mt-1">
                    {settings.supportValue}
                  </span>
                </div>
              </div>

              {/* آیتم ۲: روز های کاری */}
              <div className="flex items-center justify-start gap-3.5">
                <div className="w-[46px] h-[46px] rounded-[11px] bg-[#f4f1ea] text-[#a98552] flex items-center justify-center shrink-0">
                  <CalendarVectorIcon className="w-[22px] h-[22px]" />
                </div>
                <div className="text-right min-w-0">
                  <span className="block text-[12.5px] text-[#555555]">
                    {settings.workingDaysTitle}
                  </span>
                  <span className="block text-[13px] sm:text-[13.5px] font-bold text-[#1e1e1e] mt-1 tabular-nums">
                    {settings.workingDaysHours}
                  </span>
                </div>
              </div>

              {/* آیتم ۳: روز های تعطیل */}
              <div className="flex items-center justify-start gap-3.5">
                <div className="w-[46px] h-[46px] rounded-[11px] bg-[#f4f1ea] text-[#a98552] flex items-center justify-center shrink-0">
                  <ClockVectorIcon className="w-[22px] h-[22px]" />
                </div>
                <div className="text-right min-w-0">
                  <span className="block text-[12.5px] text-[#555555]">
                    {settings.holidaysTitle}
                  </span>
                  <span className="block text-[13px] sm:text-[13.5px] font-bold text-[#1e1e1e] mt-1 tabular-nums">
                    {settings.holidaysHours}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ستون چپ: تماس با ما */}
        <div>
          <div className="flex items-center justify-start gap-2.5 mb-4">
            <span className="w-[3.5px] h-5.5 rounded-full bg-[#b08c57] shrink-0" />
            <h3 className="text-[16px] sm:text-[17.5px] font-bold text-[#1e1e1e]">
              تماس با ما
            </h3>
          </div>

          <div className="rounded-[16px] border border-[#eaeaea] bg-white p-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4 items-center">
              {/* آیتم ۱: آدرس ایمیل */}
              <div className="flex items-center justify-start gap-3.5">
                <div className="w-[46px] h-[46px] rounded-[11px] bg-[#f4f1ea] text-[#a98552] flex items-center justify-center shrink-0">
                  <SmsVectorIcon className="w-[22px] h-[22px]" />
                </div>
                <div className="text-right min-w-0">
                  <span className="block text-[12.5px] text-[#555555]">
                    {settings.emailTitle}
                  </span>
                  <span
                    dir="ltr"
                    className="block text-[13px] sm:text-[13.5px] font-bold text-[#1e1e1e] mt-1 font-sans text-right"
                  >
                    {settings.emailAddress}
                  </span>
                </div>
              </div>

              {/* آیتم ۲: شماره مدیریت */}
              <div className="flex items-center justify-start gap-3.5">
                <div className="w-[46px] h-[46px] rounded-[11px] bg-[#f4f1ea] text-[#a98552] flex items-center justify-center shrink-0">
                  <CrownVectorIcon className="w-[22px] h-[22px]" />
                </div>
                <div className="text-right min-w-0">
                  <span className="block text-[12.5px] text-[#555555]">
                    {settings.managerPhoneTitle}
                  </span>
                  <span className="block text-[13px] sm:text-[13.5px] font-bold text-[#1e1e1e] mt-1 tabular-nums">
                    {settings.managerPhone}
                  </span>
                </div>
              </div>

              {/* آیتم ۳: شماره ثابت */}
              <div className="flex items-center justify-start gap-3.5">
                <div className="w-[46px] h-[46px] rounded-[11px] bg-[#f4f1ea] text-[#a98552] flex items-center justify-center shrink-0">
                  <CallCallingVectorIcon className="w-[22px] h-[22px]" />
                </div>
                <div className="text-right min-w-0">
                  <span className="block text-[12.5px] text-[#555555]">
                    {settings.landlinePhoneTitle}
                  </span>
                  <span className="block text-[13px] sm:text-[13.5px] font-bold text-[#1e1e1e] mt-1 tabular-nums">
                    {settings.landlinePhone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ۳. ردیف دوم: «آدرس شعبه های صالحی» و «تماس با شعبات صالحی» ==================== */}
      <section className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8">
        {/* ستون راست: آدرس شعبه های صالحی */}
        <div>
          <div className="flex items-center justify-start gap-2.5 mb-4">
            <span className="w-[3.5px] h-5.5 rounded-full bg-[#b08c57] shrink-0" />
            <h3 className="text-[16px] sm:text-[17.5px] font-bold text-[#1e1e1e]">
              آدرس شعبه های صالحی
            </h3>
          </div>

          {/* در موبایل یک کارت یکپارچه با خط جداکننده (عکس نهم) و در دسکتاپ ۳ کارت مجزا (عکس اول) */}
          <div className="rounded-[16px] border border-[#eaeaea] bg-white p-5 divide-y divide-[#efefef] md:rounded-none md:border-none md:bg-transparent md:p-0 md:divide-y-0 md:space-y-4">
            {settings.branchLocations.map((branch, idx) => (
              <div
                key={branch.id || `branch-${idx}`}
                className="md:rounded-[16px] md:border md:border-[#eaeaea] md:bg-white px-5 py-5 md:px-6 md:py-5 md:h-[96px] flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#efefef] last:border-b-0 md:border-b-0"
              >
                <div className="flex items-center justify-start gap-3.5 min-w-0">
                  <div className="w-[46px] h-[46px] rounded-[11px] bg-[#f4f1ea] text-[#a98552] flex items-center justify-center shrink-0">
                    <LocationTickVectorIcon className="w-[22px] h-[22px]" />
                  </div>
                  <div className="text-right min-w-0">
                    <span className="block text-[12.5px] sm:text-[13px] font-semibold text-[#333333]">
                      {branch.branchTitle}
                    </span>
                    <p className="text-[12.5px] sm:text-[13.5px] font-bold text-[#1e1e1e] mt-1.5 leading-relaxed">
                      {branch.address}
                    </p>
                  </div>
                </div>

                {/* دکمه «لوکیشن با نشان» با لینک مستقیم مسیریابی نشان */}
                <a
                  href={branch.neshanUrl || 'https://neshan.org'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-[44px] px-4 rounded-[10px] bg-[#f5f5f5] hover:bg-[#ebebeb] transition-colors flex items-center gap-2.5 shrink-0 cursor-pointer"
                >
                  <NeshanMapLogo className="w-[22px] h-[22px]" />
                  <span className="text-[12.5px] font-bold text-[#1e1e1e] whitespace-nowrap">
                    لوکیشن با نشان
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ستون چپ: تماس با شعبات صالحی */}
        <div>
          <div className="flex items-center justify-start gap-2.5 mb-4">
            <span className="w-[3.5px] h-5.5 rounded-full bg-[#b08c57] shrink-0" />
            <h3 className="text-[16px] sm:text-[17.5px] font-bold text-[#1e1e1e]">
              تماس با شعبات صالحی
            </h3>
          </div>

          {/* در موبایل یک کارت یکپارچه (عکس نهم) و در دسکتاپ ۳ کارت مجزا هم‌تراز با کارت‌های آدرس (عکس اول) */}
          <div className="rounded-[16px] border border-[#eaeaea] bg-white p-5 space-y-5 md:rounded-none md:border-none md:bg-transparent md:p-0 md:space-y-4">
            {settings.branchPhones.map((item, idx) => (
              <div
                key={item.id || `phone-${idx}`}
                className="md:rounded-[16px] md:border md:border-[#eaeaea] md:bg-white md:px-6 md:py-5 md:h-[96px] flex flex-row items-center justify-between gap-3.5"
              >
                <div className="flex items-center justify-start gap-3.5 min-w-0">
                  <div className="w-[46px] h-[46px] rounded-[11px] bg-[#f4f1ea] text-[#a98552] flex items-center justify-center shrink-0">
                    <CallCallingVectorIcon className="w-[22px] h-[22px]" />
                  </div>
                  <div className="text-right min-w-0">
                    <span className="block text-[12.5px] sm:text-[13px] font-semibold text-[#333333]">
                      {item.title}
                    </span>
                    <span className="block text-[13px] sm:text-[13.5px] font-bold text-[#1e1e1e] mt-0 tabular-nums">
                      {item.phone}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ۴. بخش فرم «با ما در ارتباط باشید» ==================== */}
      <section className="mt-12 sm:mt-16">
        <div className="text-right mb-8">
          <div className="flex items-center justify-start gap-3 mb-3">
            <h3 className="text-[18px] sm:text-[22px] font-black text-[#1e1e1e]">
              با ما در ارتباط باشید
            </h3>
          </div>
          <p className="text-[13.5px] sm:text-[14.5px] text-[#666666] leading-relaxed">
            دوست داریم نظرات و پیشنهادات شما را بشنویم. پیام‌هایتان را با ما در میان بگذارید تا در اسرع وقت پاسخگوی شما باشیم.
          </p>
        </div>

        <form onSubmit={handleSubmitForm}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* ستون چپ (ورودی‌ها): قرارگیری در راست در دسکتاپ طبق عکس */}
            <div className="lg:col-span-4 flex flex-col gap-3.5 sm:gap-4">
              <div className="w-full h-[50px] rounded-[12px] border border-[#2b2b2b] bg-white px-4 flex items-center justify-between gap-2.5 transition-colors">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="* موضوع مورد نظر خود را وارد نمایید"
                  className="w-full h-full bg-transparent text-right text-[13px] font-semibold text-[#1e1e1e] placeholder:text-[#9a9a9a] placeholder:font-normal focus:outline-none"
                />
                <span className="px-2.5 py-1 rounded-[6px] bg-[#efefef] text-[#444444] text-[11px] font-medium shrink-0 tabular-nums select-none">
                  {subjectCharCountDisplay}
                </span>
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="* نام و نام خانوادگی خود را وارد نمایید"
                className="w-full h-[50px] rounded-[12px] border border-[#eaeaea] focus:border-[#2b2b2b] bg-white px-4 text-right text-[13px] text-[#1e1e1e] placeholder:text-[#9a9a9a] focus:outline-none transition-colors"
              />
              <input
                type="tel"
                required
                value={mobilePhone}
                onChange={(e) => setMobilePhone(e.target.value)}
                placeholder="* شماره موبایل خود را وارد نمایید"
                className="w-full h-[50px] rounded-[12px] border border-[#eaeaea] focus:border-[#2b2b2b] bg-white px-4 text-right text-[13px] text-[#1e1e1e] placeholder:text-[#9a9a9a] focus:outline-none transition-colors"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="* ایمیل خود را وارد نمایید"
                className="w-full h-[50px] rounded-[12px] border border-[#eaeaea] focus:border-[#2b2b2b] bg-white px-4 text-right text-[13px] text-[#1e1e1e] placeholder:text-[#9a9a9a] focus:outline-none transition-colors"
              />
            </div>

            {/* ستون راست (متن): قرارگیری در چپ در دسکتاپ طبق عکس */}
            <div className="lg:col-span-8 flex">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="* متن مورد نظر خود را وارد نمایید..."
                className="w-full min-h-[165px] lg:min-h-full rounded-[12px] border border-[#eaeaea] focus:border-[#2b2b2b] bg-white p-4 text-right text-[13px] text-[#1e1e1e] placeholder:text-[#9a9a9a] focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* دکمه ارسال درخواست در پایین سمت راست به همراه لودینگ در دسکتاپ و موبایل */}
          <div className="mt-4 sm:mt-5 flex justify-start">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[46px] min-w-[146px] px-7 rounded-[10px] bg-[#272727] hover:bg-[#1a1a1a] active:bg-[#111111] disabled:opacity-85 text-white text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                  <span>در حال ارسال...</span>
                </>
              ) : (
                <span>ارسال درخواست</span>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default ContactUsContentSection;
