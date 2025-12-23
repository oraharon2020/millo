// Script to seed dummy projects
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tlzyscjvkgvlmveyfpup.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsenlzY2p2a2d2bG12ZXlmcHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MzIzNDIsImV4cCI6MjA4MjAwODM0Mn0.MKhDTF8N1adS-Xx6b8jZSlo-B2aBVwuRB2sM9VFlWWY'
);

const dummyProjects = [
  {
    title: 'מטבח בסגנון מודרני בהתאמה אישית',
    description: 'מטבח מודרני עם קווים נקיים, משטחי קוורץ לבנים וארונות בגוון אפור פחם. עיצוב מינימליסטי שמשלב פונקציונליות מקסימלית עם אסתטיקה נקייה. ראשון לציון.',
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    category: 'מודרני'
  },
  {
    title: 'מטבח בסגנון בוהו כפרי בהתאמה אישית',
    description: 'שילוב מושלם של עץ טבעי עם אלמנטים כפריים. מטבח חם ומזמין עם דלתות שייקר בגוון שמנת ומשטחי בוצ\'ר מעץ אלון. רמת השרון.',
    image_url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80',
    category: 'בוהו'
  },
  {
    title: 'מטבח בסגנון אורבני בהתאמה אישית',
    description: 'מטבח בסגנון אורבני-תעשייתי עם משטחי בטון, ברז שחור מט וארונות בגוון ירוק יער עמוק. תל אביב.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    category: 'אורבני'
  },
  {
    title: 'מטבח בסגנון בוהו כפרי בהתאמה אישית',
    description: 'מטבח כפרי עם ארונות עץ מלא בגוון טבעי, ידיות ברונזה וינטג\' ומשטחי גרניט בגוון חום חם. רמת השרון.',
    image_url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
    category: 'כפרי'
  },
  {
    title: 'מטבח בסגנון מודרני בהתאמה אישית',
    description: 'מטבח מודרני בגווני שחור ולבן עם אי מרכזי גדול, תאורת LED משולבת ומערכת אחסון חכמה. ראשון לציון.',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    category: 'מודרני'
  },
  {
    title: 'מטבח בסגנון אורבני בהתאמה אישית',
    description: 'עיצוב אורבני עכשווי עם קיר לבנים חשוף, ארונות בגוון כחול כהה ומשטחי שיש קררה. תל אביב.',
    image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    category: 'אורבני'
  },
  {
    title: 'מטבח בסגנון בוהו כפרי בהתאמה אישית',
    description: 'מטבח בוהו-שיק עם ארונות בגוון ורוד מאובק, משטחי עץ וקולקציית כלים מקרמיקה בעבודת יד. רמת השרון.',
    image_url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80',
    category: 'בוהו'
  },
  {
    title: 'מטבח בסגנון מודרני בהתאמה אישית',
    description: 'מטבח מודרני יוקרתי עם ארונות בגוון ברונזה מט, משטחי דקטון ומכשירי חשמל משולבים. הרצליה.',
    image_url: 'https://images.unsplash.com/photo-1600566752547-33b9e2e08bca?w=800&q=80',
    category: 'יוקרתי'
  }
];

async function seedProjects() {
  console.log('Seeding projects...');
  
  const { data, error } = await supabase
    .from('projects')
    .insert(dummyProjects)
    .select();
  
  if (error) {
    console.error('Error seeding projects:', error);
    return;
  }
  
  console.log(`Successfully inserted ${data.length} projects!`);
  console.log(data);
}

seedProjects();
