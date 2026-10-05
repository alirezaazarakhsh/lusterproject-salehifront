import React, { useState } from 'react';
import { navigateToRoute } from '../../utils/navigation';

interface ServerErrorContentSectionProps {
  onRetry?: () => void;
}

/**
 * تصویر برداری دقیق ربات لامپی با دوشاخه کشیده‌شده از پریز (Error Lamp Robot 2.png)
 * دقیقاً مطابق تصویر سوم ارسالی
 */
const ErrorLampRobotIllustration: React.FC<{ className?: string }> = ({
  className = 'w-full h-auto',
}) => (
  <svg
    viewBox="0 0 520 430"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none ${className}`}
    role="img"
    aria-label="قطعی برق در سرور هاستینگ"
  >
    {/* ==================== ۱. پرتوهای هشدار زرد/نارنجی بالای سر ربات ==================== */}
    <path d="M60 66L45 81L104 114L108 108L60 66Z" fill="#FBBE67" />
    <path d="M50 100L46 116L101 127L103 121L50 100Z" fill="#FBBE67" />

    {/* ==================== ۲. لکه قهوه‌ای و قطره‌های روی زمین زیر پای ربات ==================== */}
    {/* قطره کوچک کرم سمت چپ */}
    <ellipse cx="140" cy="346" rx="14" ry="3.2" fill="#E8DAC6" />
    {/* قطره بیضی کرم سمت راست */}
    <ellipse cx="352" cy="358" rx="19.5" ry="4.5" fill="#E8DAC6" />
    {/* لکه اصلی قهوه‌ای زیر پا */}
    <path
      d="M172 342C162 342 158 346 168 348C175 349 162 350 148 351C133 352 130 359 148 360C166 361 288 361 306 360C324 359 326 351 310 350C298 349 306 348 318 347C332 346 330 341 312 341C294 341 188 342 172 342Z"
      fill="#A47D4D"
    />

    {/* ==================== ۳. پریز برق، جرقه‌ها و سیم کشیده‌شده در سمت راست ==================== */}
    {/* دو پرتو آبی کمرنگ بالای پریز */}
    <path d="M405 290L402 256L414 258L409 290H405Z" fill="#D6E8FF" />
    <path d="M413 292L423 260L435 266L417 293L413 292Z" fill="#D6E8FF" />

    {/* جرقه ستاره‌ای زرد کنار پریز */}
    <path
      d="M425 297L427 283L436 291L449 286L442 298L455 304L438 309C434 304 430 300 425 297Z"
      fill="#FBBE67"
    />

    {/* بدنه پریز برق دیواری */}
    <rect
      x="380"
      y="302"
      width="48"
      height="40"
      rx="6.5"
      fill="#DCEBFF"
    />
    <path
      d="M421.5 302H386.5C382.91 302 380 304.91 380 308.5V310H418C421.59 310 424.5 312.91 424.5 316.5V342C426.5 340.8 428 338.4 428 335.5V308.5C428 304.91 425.09 302 421.5 302Z"
      fill="#CBE0FE"
    />
    {/* دایره داخلی پریز */}
    <circle cx="404" cy="322" r="14" fill="#C9E0FF" />
    {/* دو سوراخ عمودی پریز */}
    <rect x="397.2" y="316" width="2.6" height="11.5" rx="1.3" fill="#2A3759" />
    <rect x="408.2" y="316" width="2.6" height="11.5" rx="1.3" fill="#2A3759" />

    {/* سیم برق مشکی متصل به پشت ربات */}
    <path
      d="M270 198C302 186 332 208 350 246C368 284 393 298 416 280C424 274 431 266 436 261"
      stroke="#2B2B2B"
      strokeWidth="3.8"
      strokeLinecap="round"
    />

    {/* دو شاخه فلزی سر دوشاخه */}
    <path
      d="M446 251L454 245"
      stroke="#2B2B2B"
      strokeWidth="3.8"
      strokeLinecap="round"
    />
    <path
      d="M451 257L459 251"
      stroke="#2B2B2B"
      strokeWidth="3.8"
      strokeLinecap="round"
    />
    {/* بدنه دوشاخه آبی روشن */}
    <path
      d="M432 257C430 254 431 249 436 245L446 239C448 238 450 239 451 241L459 252C460 254 459 256 457 258L447 265C442 268 436 266 433 261L432 257Z"
      fill="#DCE8FA"
    />
    <path
      d="M446 239L451 241L459 252C460 254 459 256 457 258L447 265C444 267 440 267 437 265L451 254L446 239Z"
      fill="#C2D5F2"
    />

    {/* ==================== ۴. دست چپ (عقبی) ربات ==================== */}
    <g>
      <path
        d="M134 216C136 248 154 286 184 306L196 293C172 275 156 242 154 212L134 216Z"
        fill="#E5F0FF"
      />
      <path
        d="M144 214C146 245 163 280 190 299L196 293C172 275 156 242 154 212L144 214Z"
        fill="#CFE2FE"
      />
      {/* خطوط مفصل بازوی چپ */}
      <path
        d="M138 236C143 234 150 233 157 234"
        stroke="#B8D4FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M146 258C151 255 158 253 165 254"
        stroke="#B8D4FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M159 280C164 276 170 273 177 273"
        stroke="#B8D4FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M174 297C178 292 184 289 190 288"
        stroke="#B8D4FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* پنجه و انگشتان دست چپ */}
      <path
        d="M183 305C190 311 201 313 207 309C209 307 208 304 204 304L194 302L206 301C209 300 210 297 206 296L195 295L204 293C207 292 206 289 202 289C196 289 190 291 186 294L183 305Z"
        fill="#DCEBFE"
        stroke="#B8D4FC"
        strokeWidth="1.6"
      />
    </g>

    {/* ==================== ۵. پای راست (بلندشده به عقب) ==================== */}
    <g>
      {/* کفش پای عقب */}
      <path
        d="M273 292C278 288 286 290 293 298L308 317C313 324 311 331 305 331C298 331 286 322 276 309C269 300 268 295 273 292Z"
        fill="#262626"
      />
      <path
        d="M271 295C273 292 277 294 283 301L304 328C301 330 296 329 290 323L272 301C270 298 270 296 271 295Z"
        fill="#575757"
      />
      {/* ساق پای عقب */}
      <path
        d="M214 256C222 288 248 308 282 311L284 292C258 289 240 273 234 248L214 256Z"
        fill="#DCEBFE"
      />
      {/* خطوط مفصل پای عقب */}
      <path
        d="M225 278C231 273 238 269 245 268"
        stroke="#B5D2FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M244 297C249 290 255 284 261 282"
        stroke="#B5D2FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M268 308C270 301 273 295 276 291"
        stroke="#B5D2FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </g>

    {/* ==================== ۶. تنه اصلی ربات و نمایشگر ضربان سینه ==================== */}
    <g>
      {/* کتف چپ تیره */}
      <ellipse
        cx="138"
        cy="205"
        rx="13"
        ry="18"
        transform="rotate(-18 138 205)"
        fill="#3A3A3A"
      />
      {/* بدنه سفید-آبی تنه */}
      <path
        d="M138 192L242 134C264 168 278 208 273 238C268 265 242 280 212 274C182 268 154 236 138 192Z"
        fill="#F2F7FF"
      />
      {/* سایه آبی ملایم کناره تنه */}
      <path
        d="M225 143L242 134C264 168 278 208 273 238C268 265 242 280 212 274C195 270 179 258 165 240C196 250 226 240 236 215C245 192 238 165 225 143Z"
        fill="#DCEBFE"
      />
      {/* خط منحنی کناره پشت ربات */}
      <path
        d="M233 140C254 174 266 212 262 242"
        stroke="#B8D4FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* صفحه نمایشگر مشکی روی سینه ربات */}
      <path
        d="M143 196L195 167L215 213L166 239L143 196Z"
        fill="#242424"
      />
      {/* خط ضربان قلب (ECG) روی نمایشگر سینه */}
      <path
        d="M207 189L173 207L168 216L160 207L152 211"
        stroke="#F3D5A8"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* ==================== ۷. پای چپ (ایستاده روی زمین) ==================== */}
    <g>
      {/* کفش پای ایستاده */}
      <path
        d="M214 333L244 327C249 331 251 339 247 343C242 346 212 348 202 345C196 343 198 337 214 333Z"
        fill="#262626"
      />
      <path
        d="M199 342C210 345 238 344 248 340C249 342 248 345 244 346C234 348 208 348 200 346C197 345 197 343 199 342Z"
        fill="#575757"
      />
      {/* ساق پای ایستاده */}
      <path
        d="M214 224C196 248 196 292 216 336L238 330C220 292 220 254 236 234L214 224Z"
        fill="#EBF3FF"
      />
      <path
        d="M225 229C210 250 210 292 228 333L238 330C220 292 220 254 236 234L225 229Z"
        fill="#D4E6FE"
      />
      {/* خطوط مفصل پای ایستاده */}
      <path
        d="M204 252C211 250 219 250 227 253"
        stroke="#B5D2FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M202 276C210 274 218 274 225 277"
        stroke="#B5D2FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M206 301C213 298 221 297 228 299"
        stroke="#B5D2FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M213 323C220 320 227 318 234 319"
        stroke="#B5D2FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </g>

    {/* ==================== ۸. کتف و دست راست (جلویی) ربات ==================== */}
    <g>
      {/* بازوی راست */}
      <path
        d="M206 184C220 222 252 248 286 244L286 226C260 228 234 206 224 176L206 184Z"
        fill="#EBF3FF"
      />
      <path
        d="M215 180C228 215 256 238 286 236V244C252 248 220 222 206 184L215 180Z"
        fill="#D4E6FE"
      />
      {/* خطوط مفصل بازوی راست */}
      <path
        d="M216 205C222 200 229 197 236 196"
        stroke="#B5D2FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M231 225C236 219 242 214 249 212"
        stroke="#B5D2FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M251 239C255 232 260 226 266 223"
        stroke="#B5D2FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M274 244C275 237 277 230 281 226"
        stroke="#B5D2FC"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* پنجه و انگشتان دست راست */}
      <path
        d="M284 243C294 242 303 234 305 224C306 220 302 219 300 223L295 232L299 220C300 216 296 215 294 219L289 229L292 218C292 214 288 214 287 218C285 224 283 229 282 234L284 243Z"
        fill="#DCEBFE"
        stroke="#B5D2FC"
        strokeWidth="1.6"
      />
      {/* کتف مشکی/خاکستری راست */}
      <path
        d="M200 165C210 160 224 166 230 178C235 188 232 195 222 200C212 205 202 201 197 191C191 180 192 170 200 165Z"
        fill="#242424"
      />
      <path
        d="M200 165C209 161 221 165 228 175C220 171 208 175 201 184C196 177 195 168 200 165Z"
        fill="#4A4A4A"
      />
    </g>

    {/* ==================== ۹. سر لامپی نارنجی ربات با چشم‌های ضربدری X ==================== */}
    <g>
      {/* پایه/طوقه زیر سر لامپ */}
      <path
        d="M133 186L238 128L243 137L138 195L133 186Z"
        fill="#242424"
      />
      <path
        d="M133 186L173 164L178 173L138 195L133 186Z"
        fill="#474747"
      />

      {/* حباب اصلی سر لامپ (کرم-نارنجی روشن در بالا و نارنجی پررنگ در پایین) */}
      <path
        d="M133 186L114 148C96 112 110 68 146 50C182 32 226 46 244 82L238 128L133 186Z"
        fill="#FDD49A"
      />
      {/* لایه میانی کهربایی/نارنجی */}
      <path
        d="M133 186L116 152C102 122 110 86 134 64C158 72 176 88 174 108C172 126 192 132 214 118C222 113 232 116 238 128L133 186Z"
        fill="#FBBE67"
      />
      {/* لایه پایینی نارنجی پررنگ حباب */}
      <path
        d="M133 186L124 168C142 142 178 118 228 110L238 128L133 186Z"
        fill="#F79421"
      />
      {/* نوار باریک هایلایت کناره چپ حباب */}
      <path
        d="M133 186L114 148C101 122 106 91 124 69C116 94 118 124 132 152L141 181L133 186Z"
        fill="#FEE1B6"
      />

      {/* چشم ضربدری X سمت چپ */}
      <g
        stroke="#2B2B2B"
        strokeWidth="6.2"
        strokeLinecap="round"
      >
        <path d="M113 145L135 155" />
        <path d="M128 138L120 162" />
      </g>

      {/* چشم ضربدری X سمت راست */}
      <g
        stroke="#2B2B2B"
        strokeWidth="7.2"
        strokeLinecap="round"
      >
        <path d="M152 126L182 137" />
        <path d="M171 116L163 147" />
      </g>
    </g>
  </svg>
);

export const ServerErrorContentSection: React.FC<
  ServerErrorContentSectionProps
> = ({ onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetryClick = () => {
    if (isRetrying) return;
    setIsRetrying(true);
    window.setTimeout(() => {
      setIsRetrying(false);
      if (onRetry) {
        onRetry();
      } else {
        navigateToRoute('home');
      }
    }, 450);
  };

  return (
    <main className="w-full min-h-screen lg:min-h-[calc(100vh-89px)] flex flex-col items-center justify-center px-6 py-10 bg-[#fcfbf9] text-center select-none">
      <div className="w-full max-w-[560px] mx-auto flex flex-col items-center justify-center">
        {/* تصویر ربات لامپی بالا (Error Lamp Robot 2.png) */}
        <div className="w-[245px] xs:w-[265px] sm:w-[315px] lg:w-[345px] mb-5 sm:mb-7 flex items-center justify-center">
          <ErrorLampRobotIllustration className="w-full h-auto" />
        </div>

        {/* عنوان اصلی */}
        <h1 className="text-[21px] xs:text-[23px] sm:text-[29px] lg:text-[33px] font-black text-[#121212] tracking-tight leading-snug">
          مشکلی رخ داد!
        </h1>

        {/* زیرعنوان توضیحی قطعی برق سرور هاستینگ */}
        <p className="text-[12.5px] xs:text-[13.5px] sm:text-[15.5px] lg:text-[16.5px] font-semibold text-[#4e4e4e] mt-3 sm:mt-4 leading-relaxed">
          قطعی برق در سرور هاستینگ سامانه لوستر صالحی رخ داده است.
        </p>

        {/* دکمه کپسولی «تلاش مجدد» (در موبایل عریض‌تر و در دسکتاپ جمع‌وجور مطابق تصاویر ۱ و ۲) */}
        <button
          type="button"
          onClick={handleRetryClick}
          disabled={isRetrying}
          className="mt-8 sm:mt-9 w-[230px] sm:w-[136px] h-[48px] sm:h-[44px] rounded-full border-[1.6px] border-[#242424] bg-transparent hover:bg-[#242424] text-[#1e1e1e] hover:text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {isRetrying ? (
            <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <span className="text-[13.5px] sm:text-[13.5px] font-bold whitespace-nowrap">
              تلاش مجدد
            </span>
          )}
        </button>
      </div>
    </main>
  );
};

export default ServerErrorContentSection;
