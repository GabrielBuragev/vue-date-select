<template>
  <div id="app">
    <div class="wrapper" style="padding-top:50px; padding-bottom:50px;">
      <DateSelect
        v-model="date"
        dateFormat="dd.mm.yyyy"
        :yearRange="[1990, 2019]"
        :startDay="6"
        :startMonth="6"
        :startYear="2000"
        locale="de_DE"
        :dragscroll="true"
      ></DateSelect>
    </div>
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
}
html {
  background-color: gray;
}
.datepicker-wrapper {
  width: 50%;
  margin-left: 25%;
}
.datepicker {
  padding: 15px 5px 15px 5px;
  border: 1px solid black;
  margin: 0;
}
</style>
