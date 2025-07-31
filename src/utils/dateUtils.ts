export const getHijriDate = (): string => {
  const now = new Date();
  const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(now);
  return hijriDate;
};

export const getGregorianDate = (): string => {
  const now = new Date();
  const gregorianDate = new Intl.DateTimeFormat('ar', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(now);
  return gregorianDate;
};

export const getCurrentTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString('ar', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export const getDayOfYear = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const getDaysUntilSalary = (): { days: number; isToday: boolean } => {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // افتراض أن الراتب في يوم 27 من كل شهر
  const salaryDay = 27;
  
  let nextSalaryDate: Date;
  
  if (currentDay <= salaryDay) {
    // الراتب في نفس الشهر
    nextSalaryDate = new Date(currentYear, currentMonth, salaryDay);
  } else {
    // الراتب في الشهر القادم
    nextSalaryDate = new Date(currentYear, currentMonth + 1, salaryDay);
  }
  
  const timeDiff = nextSalaryDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  return {
    days: daysDiff,
    isToday: daysDiff === 0
  };
};

export const getWeekdayName = (): string => {
  const now = new Date();
  const weekdays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return weekdays[now.getDay()];
};

export const getMonthProgress = (): number => {
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Math.round((currentDay / daysInMonth) * 100);
}