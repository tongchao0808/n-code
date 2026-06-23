export default {
    mounted() {
      this.$bus.$on('goPageHome', () => {
        this.resetData()
      });
    },
    destroyed() {
      this.$bus.$off('goPageHome')
    },
  methods: {
    resetData() {
      const initialData = this.$options.data.call(this);
      Object.keys(initialData).forEach(key => {
        this[key] = initialData[key];
      });
      if (this.handleGoPageHome) {
        this.handleGoPageHome()
      }
    },
  }
}