module.exports = {
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
