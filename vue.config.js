module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/VUENFT/' : '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: `
            @import "@/style/base.scss";
          `,
      },
    },
  },
};
