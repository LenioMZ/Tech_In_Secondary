"use client";
import { useState } from 'react';

export default function OrderBot() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-green-700">🤖 بوت الطلبات (تقني في الثانوية)</h2>
      
      {step === 1 && (
        <div>
          <p className="mb-4 text-gray-600">أهلاً بك! قبل البدء: لا يوجد استرجاع للأموال بعد البدء.</p>
          <button onClick={nextStep} className="w-full bg-black text-white p-3 rounded-lg">موافق، ابدأ الآن</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="font-bold mb-2">المرحلة الأولى: التحضير</p>
          <a href="https://youtu.be/VHKd60PZ_tU" target="_blank" className="block text-blue-500 underline mb-2">فيديو شرح كابل الـ EDL</a>
          <a href="https://www.mediafire.com/file/2yq91k0bofzwxnc" target="_blank" className="block text-blue-500 underline mb-4">تحميل ملفات السيستم</a>
          <button onClick={nextStep} className="w-full bg-green-600 text-white p-3 rounded-lg">جهزت الملفات، التالي</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="font-bold mb-2">المرحلة الثانية: التنفيذ</p>
          <ul className="text-sm list-disc p-4 text-gray-700">
            <li>افتح UltraViewer على جهازك.</li>
            <li>اغلق التابلت تماماً.</li>
            <li>ادخل وضع الـ EDL (اضغط زر خفض الصوت 10 مرات).</li>
          </ul>
          <button onClick={nextStep} className="w-full bg-green-600 text-white p-3 rounded-lg">تم، الانتقال للدفع</button>
        </div>
      )}

      {step === 4 && (
        <div>
          <p className="font-bold mb-2 text-center">المرحلة الثالثة: الدفع (300 EGP)</p>
          <div className="bg-gray-50 p-4 rounded-lg text-xs space-y-2 mb-4">
            <p>✅ فودافون كاش: 01094536778</p>
            <p>✅ تلدا: @mahmoudlm77</p>
            <p>✅ فوري: 5078086738492573</p>
          </div>
          <p className="text-[10px] text-red-500 mb-2">استخدم كود الخصم للـ 50 الأوائل: BO2435M50</p>
          <input type="file" className="mb-4 text-xs" />
          <button onClick={() => alert('تم إرسال طلبك للمراجعة!')} className="w-full bg-blue-600 text-white p-3 rounded-lg">تأكيد وإرسال الإيصال</button>
        </div>
      )}
    </div>
  );
}