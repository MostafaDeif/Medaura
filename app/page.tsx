export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-900 mb-4">مرحبًا بكم في ميد كلينك</h1>
        <p className="text-zinc-600 mb-6">واجهة أمامية ثابتة — لا يوجد خادم. اضغط "إنشاء حساب" للانتقال إلى صفحة التسجيل.</p>
        <a href="/auth/register" className="inline-block bg-indigo-700 text-white px-6 py-2 rounded-md">إنشاء حساب</a>
      </div>
    </main>
  );
}
