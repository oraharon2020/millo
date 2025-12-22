# MILLO - אתר מטבחים מעוצבים

אתר Next.js מודרני ואלגנטי לחברת עיצוב מטבחים MILLO.

## תכונות

- ✨ עיצוב אלגנטי ומינימליסטי
- 📱 רספונסיבי מלא לכל המכשירים
- 🎨 תמיכה בעברית (RTL)
- ⚡ בנוי עם Next.js 15 ו-TypeScript
- 🎯 Tailwind CSS לעיצוב
- 🔍 SEO מותאם

## התקנה

1. **התקן את התלויות:**
```bash
cd millo
npm install
```

2. **הרץ את שרת הפיתוח:**
```bash
npm run dev
```

3. **פתח את הדפדפן:**
הכנס ל-[http://localhost:3000](http://localhost:3000)

## מבנה הפרויקט

```
millo/
├── app/                    # תיקיית App Router של Next.js
│   ├── layout.tsx         # Layout ראשי
│   ├── page.tsx          # דף הבית
│   └── globals.css       # סגנונות גלובליים
├── components/            # קומפוננטות React
│   ├── Header.tsx        # כותרת עליונה עם תפריט
│   ├── Footer.tsx        # כותרת תחתונה
│   ├── Hero.tsx          # סקשן גיבור ראשי
│   ├── KitchenStyles.tsx # סגנונות מטבחים
│   ├── DesignedForYou.tsx
│   ├── KitchenShowcase.tsx
│   ├── NotOnlyKitchens.tsx
│   ├── NiceToMillo.tsx
│   ├── CTASection.tsx
│   └── KitchenInsights.tsx
├── public/
│   └── images/           # תמונות (להוסיף כאן את התמונות שלך)
└── package.json

```

## הוספת תמונות

העתק את התמונות שלך לתיקייה `public/images/` עם השמות הבאים:
- `modern-kitchen.jpg`
- `urban-kitchen.jpg`
- `rustic-kitchen.jpg`
- `classic-kitchen.jpg`
- `luxury-kitchen.jpg`
- `boho-kitchen.jpg`
- `bedroom.jpg`
- `wardrobe.jpg`
- `bathroom.jpg`
- `wall-units.jpg`
- `blog-1.jpg`, `blog-2.jpg`, `blog-3.jpg`, `blog-4.jpg`

או עדכן את נתיבי התמונות בקומפוננטות.

## סקריפטים

- `npm run dev` - הרץ שרת פיתוח
- `npm run build` - בנה לייצור
- `npm start` - הרץ שרת ייצור
- `npm run lint` - הרץ ESLint

## התאמה אישית

### שינוי צבעים
ערוך את [app/globals.css](app/globals.css) או [tailwind.config.ts](tailwind.config.ts)

### שינוי תוכן
ערוך את הקומפוננטות בתיקייה [components/](components/)

### הוספת עמודים
צור קבצים חדשים בתיקייה [app/](app/) (כגון `app/projects/page.tsx`)

## טכנולוגיות

- [Next.js 15](https://nextjs.org/)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)

## פריסה (Deployment)

הדרך הקלה ביותר לפרוס את האתר היא דרך [Vercel](https://vercel.com):

1. העלה את הקוד ל-GitHub
2. התחבר ל-Vercel עם חשבון GitHub
3. ייבא את הפרויקט
4. Vercel יזהה אוטומטית שזה Next.js ויפרוס

## רישיון

© 2025 MILLO. כל הזכויות שמורות.
