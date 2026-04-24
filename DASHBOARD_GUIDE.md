# Dashboard Integration Guide

## تم دمج Dashboards من medurapro بنجاح ✅

هذا الدليل يشرح كيفية استخدام dashboards الجديدة المدمجة في المشروع.

---

## 1️⃣ المسارات (Routes)

### Admin Dashboard
- **URL**: `/dashboard`
- **المسار**: `app/dashboard/`
- **الوصف**: لوحة قيادة الإدارة - معلومات عامة عن النظام

### Doctor Dashboard  
- **URL**: `/doctorDash`
- **المسار**: `app/doctorDash/`
- **الوصف**: لوحة قيادة الطبيب - معلومات خاصة بالطبيب

---

## 2️⃣ هيكل المشروع

```
app/
├── dashboard/                    # Admin Dashboard
│   ├── layout.tsx               # Layout مع Sidebar و Navbar
│   ├── page.tsx                 # الصفحة الرئيسية
│   ├── components/
│   │   ├── charts/              # مكونات الرسوم البيانية
│   │   ├── layout/              # Navbar و Sidebar
│   │   └── ui/                  # مكونات UI (StatsCard)
│   ├── features/
│   │   ├── appointments/        # إدارة المواعيد
│   │   ├── doctors/             # قائمة الأطباء
│   │   └── patient/             # بيانات المرضى
│   ├── dashboardHeader/         # رأس الداشبورد
│   └── pages/                   # صفحات فرعية
│
├── doctorDash/                  # Doctor Dashboard
│   ├── layout.tsx               # نفس البنية
│   ├── page.tsx
│   ├── components/
│   ├── features/
│   ├── dashboardHeader/
│   └── pages/
│       ├── appointments/
│       ├── patients/
│       └── settings/
│
└── providers/
    └── ThemeProvider.tsx        # إدارة الثيم (Dark/Light)
```

---

## 3️⃣ المكتبات المستخدمة

تم إضافة المكتبات التالية إلى `package.json`:

```json
{
  "apexcharts": "^5.10.3",      // رسوم بيانية متقدمة
  "react-apexcharts": "^2.1.0", // مكون ApexCharts React
  "axios": "^1.12.2",            // HTTP requests
  "date-fns": "^4.1.0",          // معالجة التواريخ
  "react-day-picker": "^9.13.2", // منتقي التاريخ
  "react-gauge-component": "^2.0.26", // مكون قياس
  "recharts": "^3.7.0"           // مكتبة رسوم بيانية أخرى
}
```

### للتثبيت:
```bash
npm install
```

---

## 4️⃣ نظام الثيم (Theme System)

### الميزات:
- ✅ Dark Mode و Light Mode
- ✅ حفظ الإعدادات في localStorage
- ✅ الكشف التلقائي عن تفضيل النظام
- ✅ انتقالات سلسة بين الأثيام

### CSS Variables
متوفرة في `app/globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --card-bg: #ffffff;
  --text-primary: #171717;
  --hover-bg: #f3f4f6;
  /* و المزيد... */
}

.dark {
  --background: #0f0f0f;
  --card-bg: #1e1e1e;
  /* و المزيد... */
}
```

### الاستخدام:
في المكونات، استخدم `ThemeContext`:

```tsx
import { ThemeContext } from '@/app/providers/ThemeProvider';

function MyComponent() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button onClick={toggleTheme}>
      {darkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

---

## 5️⃣ المكونات الرئيسية

### StatsCard
- عرض الإحصائيات مع الرسوم البيانية
- يدعم Icon و Background Color و Percentage

### Charts
- **ChartBar**: رسم بياني بالأعمدة
- **DepartmentsChart**: رسم بياني للأقسام
- **VisitsGauge**: مكون القياس للزيارات

### Sidebar
- تنقل أفقي-رتل (RTL)
- قوائم متعددة المستويات
- تسليط الضوء على الصفحة النشطة

### Navbar
- البحث
- الإشعارات
- تبديل الثيم
- قائمة المستخدم

---

## 6️⃣ البيانات والـ API

الدوال الحالية تستخدم بيانات وهمية (Mock Data).

### للربط مع حقيقي:

1. استبدل البيانات الوهمية بـ API calls
2. استخدم `axios` أو `fetch` للطلبات
3. مثال:

```tsx
import axios from 'axios';

async function fetchAppointments() {
  try {
    const res = await axios.get('/api/appointments');
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
```

---

## 7️⃣ الحالة الحالية

### ما تم إضافته:
- ✅ Dashboard Admin كامل
- ✅ Dashboard Doctor كامل
- ✅ نظام الثيم (Dark/Light)
- ✅ جميع المكونات والمكتبات
- ✅ CSS و Tailwind Config

### ما يحتاج تطوير:
- 🔄 ربط البيانات الحقيقية من backend
- 🔄 تحديث endpoints في الـ services
- 🔄 إضافة Authentication checks للـ dashboards
- 🔄 Responsive design optimization

---

## 8️⃣ الأوامر الأساسية

```bash
# تثبيت المكتبات
npm install

# تشغيل الـ Development Server
npm run dev

# بناء المشروع
npm run build

# تشغيل الـ Production
npm start

# فحص الأخطاء
npm run lint
```

---

## 9️⃣ الملفات المعدلة

1. **package.json** - أضيفت dependencies جديدة
2. **app/layout.tsx** - أضيف ThemeProvider
3. **app/globals.css** - دمجت styles من medurapro
4. **tailwind.config.cjs** - تم نسخه من medurapro

---

## 🔟 الملاحظات المهمة

⚠️ **قبل الذهاب للـ Production:**

1. ✔️ استبدل البيانات الوهمية بـ APIs حقيقية
2. ✔️ أضف Authentication و Authorization
3. ✔️ اختبر Responsive Design على جميع الأجهزة
4. ✔️ تحسين الأداء (Performance optimization)
5. ✔️ إضافة Error Handling المناسب

---

## 📞 التواصل والدعم

أي أسئلة أو مشاكل؟ تحقق من:
- الملفات المتعلقة بـ Dashboard
- `next.config.ts` للإعدادات
- `tailwind.config.cjs` للـ styling

---

**آخر تحديث**: 24 أبريل 2026
**الحالة**: ✅ جاهز للاستخدام
