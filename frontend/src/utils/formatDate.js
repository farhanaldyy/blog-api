export function formatedDate(date) {
   const dateObj = new Date(date);
   const optionsDate = { year: 'numeric', month: 'short', day: 'numeric' };
   const formatDate = dateObj.toLocaleDateString('en-US', optionsDate);
   return formatDate;
}
