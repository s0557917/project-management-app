export const titleRegex = /(?<!d)t\\.*?(?=[t|c|d|dt|p][t|c|d|dt|p]?\\)|(?<!d)t\\.*(?=$)|(?<!d)t\\.*(?=\n)/;
export const titleContentRegex = /(?<=(?<!d)t\\).*?(?=[t|c|d|dt|p][t|c|d|dt|p]?\\)|(?<=(?<!d)t\\).*(?=$)|(?<=(?<!d)t\\).*(?=\n)/;
export const detailsRegex = /d\\.*?(?=[a-z|A-Z][a-z|A-Z]?\\)|d\\.*(?=$)|d\\.*(?=\n)/;
export const detailsContentRegex = /(?<=d\\).*?(?=[a-z|A-Z][a-z|A-Z]?\\)|(?<=d\\).*(?=$)|(?<=d\\).*(?=\n)/;
export const categoryRegex = /(?<=c\\).*?(?=\s*?[a-z|A-Z][a-z|A-Z]?\\)|(?<=c\\)\w*?(?=\s*?$)|(?<=c\\)\w*?(?=\s*?\n)/;
export const prioRegex = /(?<=p\\)[1-5](?=\s*)|(?<=p\\)[1-5](?=\s*$)|(?<=p\\)[1-5](?=\s*\n)/;
export const dateTimeContentRegex = /((?<=dt\\)\d{2}-\d{2}-\d{4} \d{2}:\d{2}-\d{2}:\d{2}(?=(\s*$|\s*\n|\s*[t|c|d|p|x]\\)))|((?<=dt\\)\d{2}-\d{2}-\d{4}(?=(\s*$|\s*\n|\s*[t|c|d|p|x]\\)))/g;
export const taskCompletedRegex = /x\\.*|.*x\\/;