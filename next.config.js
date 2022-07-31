/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  "@fullcalendar/common",
  "@fullcalendar/daygrid",
  "@fullcalendar/interaction",
  "@fullcalendar/react",
]);

module.exports = withTM({
  reactStrictMode: true,
  swcMinify: true,
});
