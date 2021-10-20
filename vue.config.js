module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/REPO_NAME/' : '/',
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
