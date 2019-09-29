<template>
  <div id="app">
    <DateSelect
      v-model="date"
      dateFormat="dd.mm.yyyy"
      :yearRange="[1990, 2019]"
      :startDay="6"
      :startMonth="6"
      :startYear="2000"
      locale="de_DE"
      :dragscroll="false"
    ></DateSelect>
  </div>
</template>

<script>
import DateSelect from "./components/DateSelect.vue";
export default {
  name: "app",
  components: {
    DateSelect
  },
  data() {
    return {
      date: {}
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 30px;
}
html {
  background-color: gray;
}
</style>
