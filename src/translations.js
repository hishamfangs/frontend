const translations = {
  'New Upload': {
    ar_AE: 'تحميل ملفات',
    en_US: 'New Upload'
  },
  Recent: {
    ar_AE: 'أحدث الملفات',
    en_US: 'Recent'
  },
  'View all uploads': {
    ar_AE: 'عرض جميع التحميلات',
    en_US: 'View all uploads'
  },
  'View recent': {
    ar_AE: 'عرض أحدث الملفات',
    en_US: 'View recent'
  },
  'Last Synced: ': {
    ar_AE: 'آخر مزامنة:',
    en_US: 'Last Synced: '
  },
  ago: {
    ar_AE: 'فاتوا',
    en_US: 'ago'
  },
  minute: {
    ar_AE: 'دقيقة',
    en_US: 'minute'
  },
  minutes: {
    ar_AE: 'دقائق',
    en_US: 'minutes'
  },
  second: {
    ar_AE: 'ثانية',
    en_US: 'second'
  },
  seconds: {
    ar_AE: 'ثواني',
    en_US: 'seconds'
  },
  hour: {
    ar_AE: 'ساعة',
    en_US: 'hour'
  },
  hours: {
    ar_AE: 'ساعات',
    en_US: 'hours'
  },
  '(refreshed every 10 seconds / 1 minute)': {
    ar_AE: '(يتم التحديث كل 10 ثوانٍ / دقيقة واحدة)',
    en_US: '(refreshed every 10 seconds / 1 minute)'
  },
  'Update File': {
    ar_AE: 'تحديث الملف',
    en_US: 'Update File'
  },
  'Remove File': {
    ar_AE: 'إزالة الملف',
    en_US: 'Remove File'
  },
  'Click to browse or <br />drag and drop your files': {
    ar_AE: 'انقر للتصفح أو <br />اسحب ملفاتك وأفلتها',
    en_US: 'Click to browse or <br />drag and drop your files'
  },
  'files selected.': {
    ar_AE: 'ملفات مختارة.',
    en_US: 'files selected.'
  },
  Submit: {
    ar_AE: 'تقديم',
    en_US: 'Submit'
  },
  loading: {
    ar_AE: 'تحميل',
    en_US: 'loading'
  },
  'File type: ': {
    ar_AE: 'نوع الملف:',
    en_US: 'File type: '
  },
  ' is not allowed <br /> Allowed file types are: ': {
    ar_AE: 'غير مسموح به <br /> أنواع الملفات المسموح بها هي:نوع الملف:',
    en_US: ' is not allowed <br /> Allowed file types are: '
  }
}

export default {
  translate(msg, lang) {
    if (translations[msg]?.[lang]) {
      return translations[msg][lang]
    }
    return msg
  }
}
