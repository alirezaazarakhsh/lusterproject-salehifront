import React, { useState } from 'react';
import { Smartphone, Apple, Download, Plus, Edit3, Trash2, CheckCircle, ExternalLink, Save, X, Globe, Shield, FileArchive, ArrowUpRight } from 'lucide-react';
import { MobileBuildItem, getLocalMobileBuilds, saveLocalMobileBuilds } from '../../utils/appTracker';
import { AppInstallStatsCard } from './AppInstallStatsCard';

export const MobileBuildsManager: React.FC = () => {
  const [builds, setBuilds] = useState<MobileBuildItem[]>(() => getLocalMobileBuilds());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuild, setEditingBuild] = useState<MobileBuildItem | null>(null);

  // Form State
  const [formPlatform, setFormPlatform] = useState<'android' | 'ios' | 'pwa' | 'all'>('android');
  const [formTitle, setFormTitle] = useState('');
  const [formVersion, setFormVersion] = useState('1.0.0');
  const [formFileSize, setFormFileSize] = useState('18.5 MB');
  const [formDownloadUrl, setFormDownloadUrl] = useState('');
  const [formTargetStore, setFormTargetStore] = useState('کافه بازار & مایکت');
  const [formReleaseNotes, setFormReleaseNotes] = useState('');
  const [formIsPublished, setFormIsPublished] = useState(true);

  const handleOpenAddModal = () => {
    setEditingBuild(null);
    setFormPlatform('android');
    setFormTitle('اپلیکیشن اندروید (نسخه کافه بازار & مایکت)');
    setFormVersion('1.0.0');
    setFormFileSize('18.5 MB');
    setFormDownloadUrl('/downloads/salehi-chandelier-v1.0.0.apk');
    setFormTargetStore('کافه بازار، مایکت & دانلود مستقیم APK');
    setFormReleaseNotes('انتشار نسخه جدید با قابلیت کاتالوگ ۳ بعدی و ثبت سفارش آسان.');
    setFormIsPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MobileBuildItem) => {
    setEditingBuild(item);
    setFormPlatform(item.platform);
    setFormTitle(item.title);
    setFormVersion(item.version);
    setFormFileSize(item.fileSize);
    setFormDownloadUrl(item.downloadUrl);
    setFormTargetStore(item.targetStore);
    setFormReleaseNotes(item.releaseNotes);
    setFormIsPublished(item.isPublished);
    setIsModalOpen(true);
  };

  const handleSaveBuild = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: MobileBuildItem[];

    if (editingBuild) {
      updated = builds.map((b) =>
        b.id === editingBuild.id
          ? {
              ...b,
              platform: formPlatform,
              title: formTitle,
              version: formVersion,
              fileSize: formFileSize,
              downloadUrl: formDownloadUrl,
              targetStore: formTargetStore,
              releaseNotes: formReleaseNotes,
              isPublished: formIsPublished,
              releaseDate: new Date().toISOString().split('T')[0],
            }
          : b
      );
    } else {
      const newBuildItem: MobileBuildItem = {
        id: `build-${Date.now()}`,
        platform: formPlatform,
        title: formTitle,
        version: formVersion,
        buildNumber: builds.length + 100,
        fileSize: formFileSize,
        downloadUrl: formDownloadUrl,
        targetStore: formTargetStore,
        releaseNotes: formReleaseNotes,
        isPublished: formIsPublished,
        releaseDate: new Date().toISOString().split('T')[0],
      };
      updated = [newBuildItem, ...builds];
    }

    setBuilds(updated);
    saveLocalMobileBuilds(updated);
    setIsModalOpen(false);
  };

  const handleDeleteBuild = (id: string) => {
    if (window.confirm('آیا از حذف این نسخه خروجی مطمئن هستید؟')) {
      const filtered = builds.filter((b) => b.id !== id);
      setBuilds(filtered);
      saveLocalMobileBuilds(filtered);
    }
  };

  return (
    <div className="w-full dir-rtl text-right">
      {/* Live App Installation Statistics */}
      <AppInstallStatsCard />

      {/* Main Header */}
      <div className="bg-[#1e1c18] border border-[#3a352c] rounded-2xl p-5 sm:p-7 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#3a352c]">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#e6c28b] flex items-center gap-3">
              <FileArchive className="w-7 h-7 text-[#d4af37]" />
              مدیریت و دانلود خروجی‌های اپلیکیشن (Android APK & iOS IPA)
            </h2>
            <p className="text-xs sm:text-sm text-[#a39784] mt-1">
              ثبت، بروزرسانی و قرارگیری مستقیم لینک‌های خروجی اندروید، آیفون و PWA در دیتابیس
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#121212] text-sm font-bold shadow-lg hover:brightness-110 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            افزودن خروجی جدید به دیتابیس
          </button>
        </div>

        {/* Builds Table / Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4">
          {builds.length === 0 ? (
            <div className="text-center py-12 text-[#a39784] bg-[#24201a] rounded-xl border border-[#3a352c]">
              هیچ خروجی هنوز ثبت نشده است. با کلیک بر روی دکمه بالا اولین فایل خروجی را اضافه کنید.
            </div>
          ) : (
            builds.map((b) => (
              <div
                key={b.id}
                className="bg-[#26221c] border border-[#3e372b] hover:border-[#d4af37]/60 rounded-xl p-5 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      b.platform === 'android'
                        ? 'bg-[#388e3c]/20 text-[#4caf50] border border-[#388e3c]/40'
                        : b.platform === 'ios'
                        ? 'bg-[#1976d2]/20 text-[#64b5f6] border border-[#1976d2]/40'
                        : 'bg-[#d4af37]/20 text-[#e6c28b] border border-[#d4af37]/40'
                    }`}
                  >
                    {b.platform === 'android' ? (
                      <Smartphone className="w-6 h-6" />
                    ) : b.platform === 'ios' ? (
                      <Apple className="w-6 h-6" />
                    ) : (
                      <Globe className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h4 className="text-base sm:text-lg font-bold text-white">{b.title}</h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3a3327] text-[#e6c28b] font-mono border border-[#544938]">
                        v{b.version}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1e2e1e] text-[#81c784] font-medium border border-[#2e4d2e]">
                        {b.fileSize}
                      </span>
                    </div>

                    <p className="text-xs text-[#b8ab97] mt-1.5 leading-relaxed">{b.releaseNotes}</p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#8a7f6e] mt-3">
                      <span>تاریخ انتشار: {b.releaseDate}</span>
                      <span>محل انتشار: {b.targetStore}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 border-[#3a352c] pt-3 lg:pt-0">
                  <a
                    href={b.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#383022] hover:bg-[#4a3e2a] text-[#f5d77f] border border-[#635237] text-xs font-bold transition-all"
                  >
                    <Download className="w-4 h-4 text-[#d4af37]" />
                    دانلود فایل خروجی
                  </a>

                  <button
                    onClick={() => handleOpenEditModal(b)}
                    className="p-2.5 rounded-xl bg-[#2a2620] hover:bg-[#3a342a] text-[#cbb592] border border-[#443c30] transition-all cursor-pointer"
                    title="ویرایش"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteBuild(b.id)}
                    className="p-2.5 rounded-xl bg-[#2e1d1d] hover:bg-[#422222] text-[#ef5350] border border-[#542828] transition-all cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Build Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm dir-rtl">
          <div className="bg-[#1e1c18] border border-[#4a4235] rounded-2xl w-full max-w-xl p-6 shadow-2xl text-right">
            <div className="flex items-center justify-between pb-4 border-b border-[#3a352c] mb-5">
              <h3 className="text-lg font-bold text-[#e6c28b]">
                {editingBuild ? 'ویرایش اطلاعات خروجی اپلیکیشن' : 'افزودن خروجی جدید به دیتابیس'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg bg-[#2a2620] text-[#a39784] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBuild} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#cbb592] mb-1.5">
                  پلتفرم برنامه
                </label>
                <select
                  value={formPlatform}
                  onChange={(e: any) => setFormPlatform(e.target.value)}
                  className="w-full bg-[#26221c] border border-[#443c30] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="android">اندروید (Android APK / AAB)</option>
                  <option value="ios">آیفون (iOS IPA)</option>
                  <option value="pwa">وب‌اپلیکیشن (PWA Zip / Web Package)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbb592] mb-1.5">
                  عنوان نسخه خروجی
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#26221c] border border-[#443c30] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  placeholder="مثال: اپلیکیشن اندروید (نسخه کافه بازار)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cbb592] mb-1.5">
                    شماره نسخه (Version)
                  </label>
                  <input
                    type="text"
                    required
                    value={formVersion}
                    onChange={(e) => setFormVersion(e.target.value)}
                    className="w-full bg-[#26221c] border border-[#443c30] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#d4af37]"
                    placeholder="1.0.0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbb592] mb-1.5">
                    حجم فایل
                  </label>
                  <input
                    type="text"
                    required
                    value={formFileSize}
                    onChange={(e) => setFormFileSize(e.target.value)}
                    className="w-full bg-[#26221c] border border-[#443c30] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                    placeholder="18.5 MB"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbb592] mb-1.5">
                  لینک مستقیم دانلود یا آدرس استور (APK / IPA Link)
                </label>
                <input
                  type="text"
                  required
                  value={formDownloadUrl}
                  onChange={(e) => setFormDownloadUrl(e.target.value)}
                  className="w-full bg-[#26221c] border border-[#443c30] rounded-xl px-4 py-2.5 text-sm text-white font-mono text-left focus:outline-none focus:border-[#d4af37]"
                  placeholder="/downloads/app-v1.0.0.apk یا URL مستقیم"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbb592] mb-1.5">
                  استور هدف یا توضیحات انتشار
                </label>
                <input
                  type="text"
                  value={formTargetStore}
                  onChange={(e) => setFormTargetStore(e.target.value)}
                  className="w-full bg-[#26221c] border border-[#443c30] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  placeholder="کافه بازار، مایکت، سیب‌اپ یا مستقیم"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbb592] mb-1.5">
                  تغییرات این نسخه (Release Notes)
                </label>
                <textarea
                  rows={3}
                  value={formReleaseNotes}
                  onChange={(e) => setFormReleaseNotes(e.target.value)}
                  className="w-full bg-[#26221c] border border-[#443c30] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  placeholder="توضیحات و امکانات جدید این نسخه..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublishedCheck"
                  checked={formIsPublished}
                  onChange={(e) => setFormIsPublished(e.target.checked)}
                  className="w-4 h-4 accent-[#d4af37]"
                />
                <label htmlFor="isPublishedCheck" className="text-sm text-[#e6c28b] cursor-pointer">
                  انتشار عمومی و قابل دانلود برای کاربران
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3a352c]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#2a2620] text-[#a39784] hover:text-white text-sm"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#d4af37] text-[#121212] font-bold text-sm hover:brightness-110"
                >
                  <Save className="w-4 h-4" />
                  ذخیره در دیتابیس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
