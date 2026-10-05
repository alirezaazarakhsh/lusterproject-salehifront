import React from 'react';
import { navigateToRoute } from '../utils/navigation';

interface NotFoundContentSectionProps {
  onBackToHome?: () => void;
}

/**
 * تصویر برداری دقیق ۴۰۴ با روح وسط (Group 39255.png)
 * مطابق تصویر دوم ارسالی با اعداد ۴ طلایی (#bf945f) و جزئیات کامل سایه‌روشن روح
 */
const Ghost404Illustration: React.FC<{ className?: string }> = ({
  className = 'w-full h-auto',
}) => (
  <svg
    viewBox="0 0 760 384"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none ${className}`}
    role="img"
    aria-label="404 صفحه یافت نشد"
  >
    {/* ==================== عدد 4 سمت چپ ==================== */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M92 76H147V214H172V260H147V304H92V260H0V214L92 76ZM92 214V148L50 214H92Z"
      fill="#BF945F"
    />

    {/* ==================== عدد 4 سمت راست ==================== */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M680 76H735V214H760V260H735V304H680V260H588V214L680 76ZM680 214V148L638 214H680Z"
      fill="#BF945F"
    />

    {/* ==================== کاراکتر روح میانی (Group 39255) ==================== */}
    <g>
      {/* ۱. لایه‌های سایه تیره زیرین چین‌های پارچه (#BBC4BF) */}
      {/* جیب زیر آستین چپ */}
      <path
        d="M235 173C247 167 262 170 274 180C261 178 246 176 235 173Z"
        fill="#BBC4BF"
      />
      {/* چین زیرین چپ بالا */}
      <path
        d="M279 190L301 232C289 224 280 213 279 190Z"
        fill="#BBC4BF"
      />
      {/* چین زیرین چپ میانی */}
      <path
        d="M298 242L322 282C306 278 298 264 298 242Z"
        fill="#BBC4BF"
      />
      {/* چین زیرین چپ پایین */}
      <path
        d="M323 285L343 324C328 322 322 308 323 285Z"
        fill="#BBC4BF"
      />
      {/* دنباله نوک‌تیز انتهایی پایین */}
      <path
        d="M367 352L377 363L367 380V352Z"
        fill="#BBC4BF"
      />
      {/* جیب زیر آستین راست بالا */}
      <path
        d="M502 157L505 172L488 167L502 157Z"
        fill="#BBC4BF"
      />
      {/* جیب زیر آستین راست پایین */}
      <path
        d="M474 185L482 206L468 202L474 185Z"
        fill="#BBC4BF"
      />

      {/* ۲. بدنه اصلی سفید روح (#FFFFFF) */}
      <path
        d="M381 4C425 4 444 48 449 102C451 106 458 108 462 103C466 83 476 74 488 75C503 76 512 97 518 118C522 130 528 136 527 142C526 149 513 155 502 157C492 175 480 182 474 185C467 212 461 220 457 226C455 256 453 285 442 299C433 308 415 307 408 318C405 325 409 336 404 344C397 352 383 356 378 364C366 352 360 332 351 327C339 322 329 323 325 314C321 305 333 295 336 287C318 282 302 278 299 266C296 254 303 242 301 232C288 224 279 214 281 198C283 189 291 182 294 176C283 172 276 175 273 180C261 174 246 175 235 173C238 156 243 130 250 115C258 100 272 99 283 106C289 111 293 116 296 118C305 112 309 98 312 78C318 35 344 4 381 4Z"
        fill="#FFFFFF"
      />

      {/* ۳. سایه‌روشن‌های خاکستری ملایم روی پارچه (#E3E6E5) */}
      {/* سایه کناره راست سر و تنه */}
      <path
        d="M388 5C426 8 443 50 448 102C452 108 459 108 462 103C467 82 477 75 488 75C502 76 511 96 518 118C522 130 528 136 527 142C526 148 515 154 502 157C493 173 482 181 474 185C467 210 461 219 457 226C455 255 453 284 442 299C433 308 415 307 408 318C405 325 409 336 404 344C397 352 384 356 378 363L378 242C388 258 398 286 410 292C424 298 437 284 439 258C441 228 442 192 448 168C460 165 470 155 474 134C478 114 484 96 474 92C465 89 458 122 446 124C435 126 432 95 426 62C420 29 405 12 388 5Z"
        fill="#E3E6E5"
      />
      {/* سایه چین میانی و چپ دامن */}
      <path
        d="M343 196C349 210 356 235 360 264L360 336C356 331 353 328 350 326C345 324 338 323 333 321L343 272V196Z"
        fill="#E3E6E5"
      />
      <path
        d="M361 268C367 276 373 288 378 302L377 362C370 354 364 342 360 335V268Z"
        fill="#E3E6E5"
      />
      <path
        d="M402 194C409 214 415 244 418 278C414 288 410 294 406 294L402 194Z"
        fill="#E3E6E5"
      />
      {/* سایه داخلی آستین چپ */}
      <path
        d="M236 171C245 154 256 150 269 156L274 180C261 174 247 174 236 171Z"
        fill="#E3E6E5"
      />
      <path
        d="M280 138C287 156 293 176 295 198L301 232C289 224 280 214 281 198C282 190 290 183 293 176C285 173 279 174 275 178L269 138H280Z"
        fill="#E3E6E5"
      />

      {/* ۴. خطوط دورگیری و جزئیات قلم‌مو (#494C4B) */}
      <g
        stroke="#494C4B"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* کانتور بیرونی کامل روح */}
        <path d="M381 4C425 4 444 48 449 102C451 106 458 108 462 103C466 83 476 74 488 75C503 76 512 97 518 118C522 130 528 136 527 142C526 149 513 155 502 157C492 175 480 182 474 185C467 212 461 220 457 226C455 256 453 285 442 299C433 308 415 307 408 318C405 325 409 336 404 344C397 352 383 356 378 364C366 352 360 332 351 327C339 322 329 323 325 314C321 305 333 295 336 287C318 282 302 278 299 266C296 254 303 242 301 232C288 224 279 214 281 198C283 189 291 182 294 176C283 172 276 175 273 180C261 174 246 175 235 173C238 156 243 130 250 115C258 100 272 99 283 106C289 111 293 116 296 118C305 112 309 98 312 78C318 35 344 4 381 4Z" />

        {/* خطوط جیب‌ها و لایه‌های زیرین */}
        <path d="M235 173C247 167 262 170 274 180" />
        <path d="M279 190C279 210 288 223 301 232" />
        <path d="M298 242C298 263 306 277 322 282" />
        <path d="M323 285C322 307 328 321 343 324" />
        <path d="M367 352V380L377 363" />
        <path d="M502 157L505 172L488 167" />
        <path d="M474 185L482 206L468 202" />

        {/* خط هایلایت بالای پیشانی سمت چپ */}
        <path d="M350 28C339 38 332 50 330 62" />
        <path d="M328 72L327 77" />

        {/* خطوط چین‌های داخلی آستین چپ */}
        <path d="M296 118L300 126" />
        <path d="M278 122L279 128" />
        <path d="M281 138C286 155 292 175 295 198" />
        <path d="M268 135C269 152 272 167 274 180" />
        <path d="M307 159V167" />

        {/* خطوط چین‌های داخلی آستین راست */}
        <path d="M449 102C451 112 453 118 455 123" />
        <path d="M462 103C461 109 460 113 460 116" />
        <path d="M490 110V120" />
        <path d="M491 130C493 146 493 162 491 174" />
        <path d="M483 134C481 154 476 174 474 198" />
        <path d="M460 146V153" />
        <path d="M459 164C458 192 456 220 456 248" />

        {/* خطوط عمودی چین‌های دامن روح */}
        <path d="M343 194L342 272" />
        <path d="M379 224V233" />
        <path d="M378 245L377 362" />
        <path d="M360 250V260" />
        <path d="M360 270V338" />
        <path d="M402 191C404 228 406 265 407 294" />
        <path d="M449 188L448 270" />
      </g>

      {/* ۵. چشم‌ها و دهان روح (#2A2C2B) */}
      <ellipse cx="356" cy="95" rx="10.2" ry="19.5" fill="#2A2C2B" />
      <ellipse cx="398" cy="94" rx="10.8" ry="20.5" fill="#2A2C2B" />
      <ellipse cx="380" cy="142" rx="3.2" ry="5.6" fill="#2A2C2B" />
    </g>
  </svg>
);

/**
 * آیکون فلش بازگشت (U-Turn Left) داخل دکمه «بازگشت به صفحه»
 * دقیقاً مطابق تصویر دسکتاپ و موبایل
 */
const ReturnBackIcon: React.FC<{ className?: string }> = ({
  className = 'w-[18px] h-[18px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7.13 18.31H15.13C17.89 18.31 20.13 16.07 20.13 13.31C20.13 10.55 17.89 8.31 15.13 8.31H4.13"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.43 10.81L3.87 8.25L6.43 5.69"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const NotFoundContentSection: React.FC<NotFoundContentSectionProps> = ({
  onBackToHome,
}) => {
  const handleBackClick = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigateToRoute('home');
    }
  };

  return (
    <main className="w-full min-h-screen lg:min-h-[calc(100vh-89px)] flex flex-col items-center justify-center px-6 py-10 bg-[#fcfbf9] text-center select-none">
      <div className="w-full max-w-[540px] mx-auto flex flex-col items-center justify-center">
        {/* عنوان اصلی */}
        <h1 className="text-[22px] xs:text-[24px] sm:text-[30px] lg:text-[34px] font-black text-[#121212] tracking-tight leading-snug">
          مشکلی رخ داد!
        </h1>

        {/* زیرعنوان توضیحی */}
        <p className="text-[13px] xs:text-[13.5px] sm:text-[16px] lg:text-[17px] font-semibold text-[#4e4e4e] mt-3 sm:mt-4 leading-relaxed">
          متاسفیم صفحه مورد نظر یافت نشد، لطفا دوباره امتحان کنید.
        </p>

        {/* تصویر وسط صفحه (404 با روح - Group 39255.png) */}
        <div className="w-[270px] xs:w-[295px] sm:w-[375px] lg:w-[415px] my-10 sm:my-12 flex items-center justify-center">
          <Ghost404Illustration className="w-full h-auto" />
        </div>

        {/* دکمه کپسولی «بازگشت به صفحه» */}
        <button
          type="button"
          onClick={handleBackClick}
          className="w-[215px] sm:w-[196px] h-[48px] sm:h-[46px] rounded-full border-[1.6px] border-[#242424] bg-transparent hover:bg-[#242424] text-[#1e1e1e] hover:text-white transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group"
        >
          <span className="text-[13.5px] sm:text-[14px] font-bold whitespace-nowrap">
            بازگشت به صفحه
          </span>
          <ReturnBackIcon className="w-[18px] h-[18px] shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
        </button>
      </div>
    </main>
  );
};

export default NotFoundContentSection;
