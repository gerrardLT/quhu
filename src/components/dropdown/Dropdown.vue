<template>
  <div class="dropdown">
    <button class="dropdown-toggle" @click="toggleDropdown">
      {{ selectedValue }}
      <i class="el-icon-arrow-down"></i>
    </button>
    <ul v-show="isOpen" class="dropdown-menu">
      <li
        v-for="(option, index) in options"
        :key="index"
        @click="selectOption(option)"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      required: false
    },
    drop: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isOpen: false,
      selectedValue: ''
    }
  },
  watch: {
    value: function (newVal) {
      this.selectedValue = newVal
    },
    '$i18n.locale': {
      handler(newVal, oldVal) {
        // console.log(this.value)
        if(newVal ==='en'){
          if(this.value ==='分享' || this.value ==='Share'){
          this.selectedValue = 'Share'
        }
        if(this.value ==='邀请' || this.value ==='Invite'){
          this.selectedValue = 'Invite'
        }
        }else {
          if(this.value ==='分享' || this.value ==='Share'){
          this.selectedValue = '分享'
        }
        if(this.value ==='邀请' || this.value ==='Invite'){
          this.selectedValue = '邀请'
        }
        }
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    selectOption(option) {
      this.selectedValue = option
      this.isOpen = false
      this.$emit('input', option)
      this.drop()
    }
  },
  mounted() {
    this.selectedValue =  this.value || this.$t('column_detail.share')
  }
}
</script>

<style>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  background-color: #fff;
  /* border: 1px solid #ccc; */
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 4px;
  padding: 0;
  margin: 0;
  list-style: none;
  width: calc(100% - 10px);
}

.dropdown-menu li {
  padding: 5px 10px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f2f2f2;
}
</style>
