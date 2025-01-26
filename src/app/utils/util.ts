import moment from 'moment';
export const isImageUrl = (url: string) => {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(url);
};
export const getMomentdateFrpmString = (date?: string) => {
  if (!date) return '';

  return moment(date).format('DD MMMM YYYY, h:mm:ss A');
};
