export const titleCase = (s: string) =>{
  return s.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase())
}


export const dateFormat = (date: Date | string) : string | null => {
  if(typeof date == 'string'){
    if(date == null || date == undefined){
      return null
    }
    date = new Date(date)
  }

  if(date == null || date == undefined){
    return null
  }

  const day = date.getDate();

  const month = date.getMonth();
  const monthName = ['Jan','Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

  const year = date.getFullYear();

  return day+' '+monthName[month]+' '+year;
}

export const dateTimeFormat = (date: Date | string) : string | null => {
  if(typeof date == 'string'){
    if(date == null || date == undefined){
      return null
    }
    date = new Date(date)
  }

  if(date == null || date == undefined){
    return null
  }

  const day = date.getDate();

  const month = date.getMonth();
  const monthName = ['Jan','Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

  const year = date.getFullYear();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return day+' '+monthName[month]+' '+year+' '+pad(hour,2)+':'+pad(minute,2)+':'+pad(second,2);
}

export const pad = (num: string| number, size: number, charPad: string = '0',direction: 'left' | 'right' = 'left') => {
  num = num.toString();
  if(direction === 'left'){
      while (num.length < size) num = charPad + num;
  }else{
      while (num.length < size) num = num + charPad;
  }
  return num;
}

export const fileToBase64 = (file : File) => new Promise<string | ArrayBuffer | null>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

export const Base64toFile = (dataurl: string, filename: string) => {
  var arr = dataurl.split(','),
      mime = (arr[0].match(/:(.*?);/) || [])[1],
      bstr = atob(arr[arr.length - 1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

/**
 * Function for get date now
 *
 * @return {string} with format YYYY-mm-dd
 */
export const getDateNow = (): string => {
  const date = new Date()

  let year = date.getFullYear()
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString()

  month = parseInt(month) < 10 ? `0${month}` : month
  day = parseInt(day) < 10 ? `0${day}` : day

  return `${year}-${month}-${day}`
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const blobToBase64 = (blob: Blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);

  return new Promise((resolve,reject) => {
      return reader.onloadend = () => {
          return resolve(reader.result)
      };
  })
}

export function dataURLtoFile(dataurl : string, filename: string) {
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/) || [],
      bstr = atob(arr[arr.length - 1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime?.length > 2 ? mime[1] : ''});
}

export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const timeDiff = (time1:Date | string,time2:Date | string) : string => {
  const startDate = typeof time1 == 'string' ? new Date(time1) : time1
  const endDate = typeof time2 == 'string' ? new Date(time2) : time2


  const startTime = startDate.getTime()
  const endTime = endDate.getTime()

  const diff = endTime - startTime;
  const totalseconds = Math.floor(diff / 1000);

  let res = ''

  const years = Math.floor(totalseconds / 31557600)
  if(years > 0){
    res += `${years} Year${years > 1 ? 's' : ''} `
    return res + ' ago'
  }
  
  const months = Math.floor((totalseconds % 31557600) / 2629800)
  if(months > 0){
    res += `${months} Month${months > 1 ? 's' : ''} `
    return res + ' ago'
  }

  const days = Math.floor((totalseconds % 2629800) / 86400)
  if(days > 0){
    res += `${days} Day${days > 1 ? 's' : ''} `
    return res + ' ago'
  }

  const hours = Math.floor((totalseconds % 86400) / 3600)
  if(hours > 0){
    res += `${hours} Hour${hours > 1 ? 's' : ''} `
    return res + ' ago'
  }

  const minutes = Math.floor((totalseconds % 3600) / 60)
  if(minutes > 0){
    res += `${minutes} Minute${minutes > 1 ? 's' : ''} `
    return res + ' ago'
  }

  const seconds = Math.floor((totalseconds % 60))
  if(seconds > 0){
    res += `${seconds} Second${seconds > 1 ? 's' : ''}`
    return res + ' ago'
  }
  
  return res
}

export const formatNum = (number: number | string = 0,n: number = 0, x: number = 3, s: string = '.', c: string = ',') => {
    number = typeof number === 'string' ? parseFloat(number) : number
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = number.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
}

export function capitalizeFirstLetter(string : string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function convertNullToStrip(string: string){
  return !string || string == '' ? '-' : string
}